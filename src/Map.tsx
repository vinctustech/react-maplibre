import React, {
  FC,
  useRef,
  useEffect,
  useState,
  useContext,
  useImperativeHandle,
  RefAttributes,
  ReactNode,
  CSSProperties,
  useMemo,
} from 'react'
import maplibre, { MapLibreEvent, StyleSpecification } from 'maplibre-gl'
import { ErrorBoundary } from './ErrorBoundary' // eslint-disable-line import/no-webpack-loader-syntax

export type ViewState = {
  longitude: number
  latitude: number
  zoom: number
}

export type ViewStateChangeEvent =
  | (MapLibreEvent<MouseEvent | TouchEvent | WheelEvent | undefined> & {
      type: 'movestart' | 'move' | 'moveend' | 'zoomstart' | 'zoom' | 'zoomend'
      viewState: ViewState
    })
  | (MapLibreEvent<MouseEvent | TouchEvent | undefined> & {
      type:
        | 'rotatestart'
        | 'rotate'
        | 'rotateend'
        | 'dragstart'
        | 'drag'
        | 'dragend'
        | 'pitchstart'
        | 'pitch'
        | 'pitchend'
      viewState: ViewState
    })

const DEFAULT_STYLE = 'https://demotiles.maplibre.org/style.json'
const DISABLE_PITCH = 0

const MapContext = React.createContext<{
  map: maplibre.Map | null
  mapLoaded: boolean
  setMapLoaded: React.Dispatch<React.SetStateAction<boolean>>
}>({
  map: null,
  mapLoaded: false,
  setMapLoaded: () => {
    throw new Error('Use <MapProvider>')
  },
})

export const viewStateFromMap = (map: maplibre.Map) => ({
  longitude: map.getCenter().lng,
  latitude: map.getCenter().lat,
  zoom: map.getZoom(),
})

export const useMap = () => {
  const context = useContext(MapContext)
  if (!context) {
    throw new Error('useMap must be used within a MapProvider')
  }

  return context.mapRef.current // Returns the map object directly
}

export const MapProvider: FC<{ children?: ReactNode }> = ({ children }) => {
  const mapRef = useRef<maplibre.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  return (
    <MapContext.Provider value={{ map: mapRef.current, mapLoaded, setMapLoaded }}>
      {children}
    </MapContext.Provider>
  )
}

function addEventHandler(map: maplibre.Map, type: string, handler: (e: any) => void) {
  map.on(type, (ev: any) =>
    handler({
      viewState: viewStateFromMap(map),
      ...ev,
    }),
  )
}

export type MapProps = {
  reuseMaps?: boolean
  accessToken?: string
  antialias?: boolean
  children?: ReactNode | ReactNode[]
  fallback?: ReactNode
  id?: string
  longitude: number
  latitude: number
  logoPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  maxPitch?: number
  mapStyle?: StyleSpecification | string
  onLoad?: (e: import('maplibre-gl').MapLibreEvent) => void
  onDragEnd?: (e: ViewStateChangeEvent) => void
  onMoveEnd?: (e: ViewStateChangeEvent) => void
  onZoomEnd?: (e: ViewStateChangeEvent) => void
  ref?: RefAttributes<maplibre.Map | null>
  style?: CSSProperties
  zoom: number
}

export const Map = React.forwardRef<maplibre.Map | null, MapProps>(
  (
    {
      reuseMaps = true,
      children,
      style,
      id,
      longitude,
      latitude,
      maxPitch = DISABLE_PITCH,
      mapStyle = DEFAULT_STYLE,
      zoom,
      onDragEnd,
      onLoad,
      onMoveEnd,
      onZoomEnd,
      fallback,
      ...options
    },
    ref,
  ) => {
    const mapContainer = useRef<HTMLDivElement | null>(null)
    const { map, setMapLoaded } = useMap()

    useImperativeHandle<maplibre.Map | null, maplibre.Map | null>(ref, () => map, [mapRef])

    useEffect(() => {
      if (reuseMaps && map) {
        // If we're reusing maps and a map already exists, just update the view state
        map.setCenter([longitude, latitude])
        map.setZoom(zoom)

        if (mapStyle) {
          map.setStyle(mapStyle)
        }
        return
      }

      if (mapContainer.current && !map) {
        const m = new maplibre.Map({
          container: mapContainer.current!,
          style: mapStyle,
          center: [longitude, latitude],
          zoom,
          ...options,
        })

        if (onDragEnd) addEventHandler(m, 'dragend', onDragEnd)
        if (onLoad)
          addEventHandler(m, 'load', (ev) => {
            onLoad(ev)
            setMapLoaded(true)
          })
        if (onMoveEnd) addEventHandler(m, 'moveend', onMoveEnd)
        if (onZoomEnd) addEventHandler(m, 'zoomend', onZoomEnd)

        map = m
      }

      return () => {
        if (!reuseMaps && map) {
          map.remove()
          mapRef.current = null
        }
      }
    }, [
      reuseMaps,
      mapRef,
      onDragEnd,
      onLoad,
      onMoveEnd,
      onZoomEnd,
      setMapLoaded,
      mapStyle,
      longitude,
      latitude,
      zoom,
      options,
    ])

    const memoizedStyle: CSSProperties = useMemo(
      () => ({
        position: 'relative',
        width: '100%',
        height: '100%',
        ...style,
      }),
      [style],
    )

    return (
      <ErrorBoundary fallback={fallback}>
        <div id={id} ref={mapContainer} style={memoizedStyle}>
          {children}
        </div>
      </ErrorBoundary>
    )
  },
)

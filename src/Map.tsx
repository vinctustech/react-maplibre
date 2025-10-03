import maplibre, { MapLibreEvent } from 'maplibre-gl'
import {
  createContext,
  forwardRef,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

import { ErrorBoundary } from './ErrorBoundary'

export const MapContext = createContext<{
  map: maplibre.Map | null
  mapLoaded: boolean
}>({
  map: null,
  mapLoaded: false,
})

export type MapDragEndEvent = MapLibreEvent & {
  viewState: {
    longitude: number
    latitude: number
    zoom: number
  }
}

type MapProps = {
  longitude: number
  latitude: number
  mapStyle: string
  fallback?: ReactNode
  children?: ReactNode | ReactNode[]
  onLoad?: (e: MapLibreEvent) => void
  onZoomEnd?: (e: MapLibreEvent) => void
  onDragEnd?: (e: MapDragEndEvent) => void
}

export const Map = forwardRef<maplibre.Map | null, MapProps>(
  ({ longitude, latitude, mapStyle, fallback, children, onLoad, onZoomEnd, onDragEnd }, ref) => {
    const mapContainer = useRef<HTMLDivElement | null>(null)
    const [mapInstance, setMapInstance] = useState<maplibre.Map | null>(null)
    const [mapLoaded, setMapLoaded] = useState<boolean>(false)

    useImperativeHandle<maplibre.Map | null, maplibre.Map | null>(ref, () => mapInstance, [
      mapInstance,
    ])

    useEffect(() => {
      let newMap: maplibre.Map

      if (mapContainer.current) {
        newMap = new maplibre.Map({
          container: mapContainer.current,
          style: mapStyle,
          zoom: 15,
          maxPitch: 0,
        })

        setMapInstance(newMap)

        if (onLoad) {
          newMap.on('load', (ev) => {
            onLoad(ev)

            setTimeout(() => {
              setMapLoaded(true)
            }, 500)
          })
        }

        if (onZoomEnd) {
          newMap.on('zoomend', onZoomEnd)
        }

        if (onDragEnd) {
          newMap.on('dragend', (ev) => {
            const newEvent: MapDragEndEvent = {
              ...ev,
              viewState: {
                longitude: newMap.getCenter().lng,
                latitude: newMap.getCenter().lat,
                zoom: newMap.getZoom(),
              },
            }

            onDragEnd(newEvent)
          })
        }
      }

      return () => {
        try {
          if (newMap) {
            newMap.remove()
          }

          setMapInstance(null)
          setMapLoaded(false)
        } catch {
          console.warn('Error cleaning up Map')
        }
      }
    }, [mapStyle, onLoad, onZoomEnd, onDragEnd])

    useEffect(() => {
      if (mapInstance) {
        mapInstance.setCenter([longitude, latitude])
      }
    }, [mapInstance, latitude, longitude])

    return (
      <ErrorBoundary fallback={fallback}>
        <MapContext.Provider value={{ map: mapInstance, mapLoaded }}>
          <div ref={mapContainer} style={{ width: '100%', height: '100%' }}>
            {children}
          </div>
        </MapContext.Provider>
      </ErrorBoundary>
    )
  },
)

Map.displayName = 'Map'

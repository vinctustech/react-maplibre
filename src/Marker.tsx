import {
  FC,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
  useContext,
  ReactElement,
} from 'react'
import maplibre, { PositionAnchor } from 'maplibre-gl'
import { createPortal } from 'react-dom'
import ReactDOMServer from 'react-dom/server'

import { MapContext } from './Map'

export type MarkerProps = {
  longitude: number
  latitude: number
  className?: string
  anchor?: PositionAnchor
  color?: string
  children?: ReactNode
  popup?: ReactElement
  popupClassName?: string
  closeOnClick?: boolean
  closeButton?: boolean
}

export const Marker: FC<MarkerProps> = ({
  children,
  longitude,
  latitude,
  className,
  anchor,
  color,
  popup,
  popupClassName,
  closeOnClick = false,
  closeButton = false,
}) => {
  const { map, mapLoaded } = useContext(MapContext)
  const [marker, setMarker] = useState<maplibre.Marker | null>(null)

  // The DOM element the `children` are rendered into. It is created once and reused for the
  // lifetime of the component so that the marker's content is never torn down and rebuilt.
  const element = useMemo(() => document.createElement('div'), [])

  // Keeps the newest coordinates available to the creation effect without making it depend on
  // them, so that a position change moves the existing marker instead of recreating it.
  const coordinates = useRef<[number, number]>([longitude, latitude])

  coordinates.current = [longitude, latitude]

  useEffect(() => {
    if (!map || !mapLoaded) {
      return
    }

    const newMarker = new maplibre.Marker({ anchor, className, color, element })
      .setLngLat(coordinates.current)
      .addTo(map)

    setMarker(newMarker)

    return () => {
      try {
        newMarker.remove()
      } catch {
        console.warn('Error cleaning up Marker')
      }

      setMarker(null)
    }
  }, [anchor, className, color, element, map, mapLoaded])

  useEffect(() => {
    if (marker) {
      marker.setLngLat([longitude, latitude])
    }
  }, [marker, latitude, longitude])

  useEffect(() => {
    if (!marker || !popup) {
      return
    }

    const newPopup = new maplibre.Popup({
      offset: [0, -15],
      closeButton,
      closeOnClick,
      className: popupClassName,
    }).setHTML(ReactDOMServer.renderToStaticMarkup(popup))

    // Attaching the popup to the marker lets MapLibre toggle it on click and keep it anchored to
    // the marker as the marker moves.
    marker.setPopup(newPopup)

    return () => {
      try {
        newPopup.remove()
        marker.setPopup(undefined)
      } catch {
        console.warn('Error cleaning up Marker popup')
      }
    }
  }, [marker, popup, popupClassName, closeButton, closeOnClick])

  return createPortal(children, element)
}

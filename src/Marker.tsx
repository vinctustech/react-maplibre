import { FC, useEffect, useState, ReactElement, ReactNode, useRef } from 'react'
import maplibre, { PositionAnchor } from 'maplibre-gl'
import { useMap } from './Map'
import ReactDOM from 'react-dom'
import ReactDOMServer from 'react-dom/server'

export type MarkerProps = {
  longitude: number
  latitude: number
  popup?: ReactElement
  popupClassName?: string
  closeOnClick?: boolean
  closeButton?: boolean
  anchor?: PositionAnchor
  color?: string
  children?: ReactNode
}

export const Marker: FC<MarkerProps> = ({
  children,
  longitude,
  latitude,
  popup,
  popupClassName,
  closeOnClick = false,
  closeButton = true,
  ...options
}) => {
  const { map } = useMap()
  const [result, setResult] = useState<any>(null)
  const markerRef = useRef<maplibre.Marker | null>(null)
  const popupRef = useRef<maplibre.Popup | null>(null)
  const cleanupRef = useRef<(() => void) | null>(null)
  const optionsString = JSON.stringify(options)

  useEffect(() => {
    if (!map) return

    const element = document.createElement('div')
    const parsedOptions = JSON.parse(optionsString)

    if (children) {
      setResult(ReactDOM.createPortal(children, element))
    }

    // Create marker
    const marker = children
      ? new maplibre.Marker({ ...parsedOptions, element })
      : new maplibre.Marker({ ...parsedOptions })

    marker.setLngLat([longitude, latitude]).addTo(map)
    markerRef.current = marker

    // Handle popup manually if provided
    if (popup) {
      const popupHTML = ReactDOMServer.renderToStaticMarkup(popup)

      const handleMarkerClick = (e: Event) => {
        e.stopPropagation()

        // Close existing popup if any
        if (popupRef.current) {
          popupRef.current.remove()
          popupRef.current = null
          return // Toggle behavior - close if already open
        }

        // Create new popup directly on the map
        const newPopup = new maplibre.Popup({
          offset: [0, -15],
          closeOnClick,
          closeButton,
          className: popupClassName,
        })
          .setLngLat([longitude, latitude])
          .setHTML(popupHTML)
          .addTo(map)

        popupRef.current = newPopup

        // Listen for popup close to clean up reference
        newPopup.on('close', () => {
          popupRef.current = null
        })
      }

      // Add click listener to marker element
      const markerElement = marker.getElement()
      markerElement.style.cursor = 'pointer'
      markerElement.addEventListener('click', handleMarkerClick)

      // Cleanup function
      const cleanup = () => {
        markerElement.removeEventListener('click', handleMarkerClick)
        if (popupRef.current) {
          popupRef.current.remove()
          popupRef.current = null
        }
      }

      cleanupRef.current = cleanup
    }

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current()
        cleanupRef.current = null
      }
      if (markerRef.current) {
        markerRef.current.remove()
        markerRef.current = null
      }
    }
  }, [map, optionsString, children, longitude, latitude, popup, closeOnClick, closeButton])

  return result
}

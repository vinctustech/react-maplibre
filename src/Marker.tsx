import { FC, useEffect, useState, ReactNode, useContext, ReactElement } from 'react'
import maplibre, { PositionAnchor } from 'maplibre-gl'
import ReactDOM from 'react-dom'
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
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    let marker: maplibre.Marker
    let newPopup: maplibre.Popup
    let handleMarkerClick: (e: Event) => void

    if (map && mapLoaded) {
      // We create the DOM element that we will attach to the marker, and then
      // render the `children` props into the DOM element.
      const element = document.createElement('div')

      setResult(ReactDOM.createPortal(children, element))

      marker = new maplibre.Marker({ anchor, className, color, element })
        .setLngLat([longitude, latitude])
        .addTo(map)

      if (popup) {
        const popupHTML = ReactDOMServer.renderToStaticMarkup(popup)

        handleMarkerClick = (e: Event) => {
          e.stopPropagation()

          newPopup = new maplibre.Popup({
            offset: [0, -15],
            closeButton,
            closeOnClick,
            className: popupClassName,
          })
            .setLngLat([longitude, latitude])
            .setHTML(popupHTML)
            .addTo(map)
        }

        marker.getElement().addEventListener('click', handleMarkerClick)
      }
    }

    return () => {
      try {
        if (marker) {
          marker.remove()
        }

        if (newPopup) {
          newPopup.remove()
        }

        if (marker && handleMarkerClick) {
          marker.getElement().removeEventListener('click', handleMarkerClick)
        }
      } catch {
        console.warn('Error cleaning up Marker')
      }
    }
  }, [
    anchor,
    className,
    children,
    color,
    latitude,
    longitude,
    map,
    popup,
    popupClassName,
    closeOnClick,
    closeButton,
    mapLoaded,
  ])

  return result
}

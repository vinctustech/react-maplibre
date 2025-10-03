import { FC, useEffect, ReactElement, useContext } from 'react'
import maplibre from 'maplibre-gl'
import ReactDOMServer from 'react-dom/server'

import { MapContext } from './Map'

export type PopupProps = {
  children: ReactElement
  longitude: number
  latitude: number
  className?: string
  closeOnClick?: boolean
  closeButton?: boolean
}

export const Popup: FC<PopupProps> = ({
  children,
  longitude,
  latitude,
  className,
  closeOnClick,
  closeButton,
}) => {
  const { map, mapLoaded } = useContext(MapContext)

  useEffect(() => {
    let popup: maplibre.Popup | null = null

    if (map && mapLoaded) {
      popup = new maplibre.Popup({ offset: [0, -15], className, closeOnClick, closeButton })
        .setLngLat([longitude, latitude])
        .setHTML(ReactDOMServer.renderToStaticMarkup(children))
        .addTo(map)
    }

    return () => {
      try {
        if (popup) {
          popup.remove()
        }
      } catch {
        console.warn('Error cleaning up Popup')
      }
    }
  }, [children, latitude, longitude, map, className, closeOnClick, closeButton, mapLoaded])

  return null
}

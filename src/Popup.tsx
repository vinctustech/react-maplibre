import { FC, useEffect, ReactElement, useContext, useRef } from 'react'
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
  /** Called when the user closes the popup; it is not reopened, so stop rendering it. */
  onClose?: () => void
}

export const Popup: FC<PopupProps> = ({
  children,
  longitude,
  latitude,
  className,
  closeOnClick,
  closeButton,
  onClose,
}) => {
  const { map, mapLoaded } = useContext(MapContext)
  const onCloseRef = useRef(onClose)

  onCloseRef.current = onClose

  // The content is compared by its rendered markup because `children` has a new identity on every
  // parent render.
  const html = ReactDOMServer.renderToStaticMarkup(children)

  const latest = useRef<{ html: string; coordinates: [number, number] }>({
    html,
    coordinates: [longitude, latitude],
  })
  const popupInstance = useRef<maplibre.Popup | null>(null)

  latest.current = { html, coordinates: [longitude, latitude] }

  useEffect(() => {
    if (!map || !mapLoaded) {
      return
    }

    const { html: initialHtml, coordinates } = latest.current
    const popup = new maplibre.Popup({ offset: [0, -15], className, closeOnClick, closeButton })
      .setLngLat(coordinates)
      .setHTML(initialHtml)
      .addTo(map)

    // MapLibre also fires close on unmount and when the map is removed; only a user close is reported.
    const handleClose = () => {
      if (!map._removed) {
        onCloseRef.current?.()
      }
    }

    popup.on('close', handleClose)
    popupInstance.current = popup

    return () => {
      popup.off('close', handleClose)

      try {
        popup.remove()
      } catch {
        console.warn('Error cleaning up Popup')
      }

      popupInstance.current = null
    }
  }, [map, mapLoaded, className, closeOnClick, closeButton])

  useEffect(() => {
    popupInstance.current?.setLngLat([longitude, latitude])
  }, [longitude, latitude])

  useEffect(() => {
    popupInstance.current?.setHTML(html)
  }, [html])

  return null
}

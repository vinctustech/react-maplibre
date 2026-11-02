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
  /**
   * Called when MapLibre closes the popup through its close button or a map click. The popup is
   * not reopened by a later render, so the parent should stop rendering it here.
   */
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

  // Keep the newest props available to the creation effect without making it depend on them, so
  // that content and position changes update the existing popup instead of recreating it.
  const latest = useRef({ html, coordinates: [longitude, latitude] as [number, number] })
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
    const handleClose = () => onCloseRef.current?.()

    popup.on('close', handleClose)
    popupInstance.current = popup

    return () => {
      // Removing the popup here also fires `close`, which is not a user closing it.
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

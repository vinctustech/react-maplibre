import { FC, useEffect, ReactElement } from 'react'
import maplibre from 'maplibre-gl'
import { useMap } from './Map'
import ReactDOMServer from 'react-dom/server' // eslint-disable-line import/no-webpack-loader-syntax

export type PopupProps = {
  children: ReactElement
  longitude: number
  latitude: number
  className?: string
  closeOnClick?: boolean
}

export const Popup: FC<PopupProps> = ({ children, longitude, latitude, ...options }) => {
  const { map } = useMap()
  const optionsString = JSON.stringify(options)

  useEffect(() => {
    let popup: maplibre.Popup | null = null

    if (map) {
      popup = new maplibre.Popup({ offset: [0, -15], ...JSON.parse(optionsString) })
        .setLngLat([longitude, latitude])
        .setHTML(ReactDOMServer.renderToStaticMarkup(children))
        .addTo(map)
    }

    return () => {
      if (popup) popup.remove()
    }
  }, [children, latitude, longitude, map, optionsString])

  return null
}

import { FC, useEffect, useState, Children, ReactElement, ReactNode } from 'react'
import maplibre, { PositionAnchor } from 'maplibre-gl'
import { useMap } from './Map'
import ReactDOM from 'react-dom'
import ReactDOMServer from 'react-dom/server' // eslint-disable-line import/no-webpack-loader-syntax

export type MarkerProps = {
  longitude: number
  latitude: number
  popup?: ReactElement
  closeOnClick?: boolean
  anchor?: PositionAnchor
  color?: string
  children?: ReactNode
}

export const Marker: FC<MarkerProps> = ({
  children,
  longitude,
  latitude,
  popup,
  closeOnClick,
  ...options
}) => {
  const { map } = useMap()
  const [result, setResult] = useState<any>(null)
  const optionsString = JSON.stringify(options)

  useEffect(() => {
    let marker: maplibre.Marker | null = null
    const isEmpty = Children.count(children) === 0

    if (map) {
      const element = document.createElement('div')
      const parsedOptions = JSON.parse(optionsString)

      if (!isEmpty) setResult(ReactDOM.createPortal(children, element))

      marker = isEmpty
        ? new maplibre.Marker({ ...parsedOptions })
        : new maplibre.Marker( { ...parsedOptions, element })

      if (popup)
        marker.setPopup(
          new maplibre.Popup({ offset: [0, -15], closeOnClick }).setHTML(
            ReactDOMServer.renderToStaticMarkup(popup)
          )
        )

      marker = marker.setLngLat([longitude, latitude]).addTo(map)
    }

    return () => {
      if (marker) marker.remove()
    }
  }, [closeOnClick, optionsString, setResult, children, latitude, longitude, map, popup])

  return result
}

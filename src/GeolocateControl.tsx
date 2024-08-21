import { FC, useEffect } from 'react'
import maplibre from 'maplibre-gl'
import { useMap } from './Map'
import { ControlPosition } from './types'

export type GeolocateControlProps = {
  position?: ControlPosition
  showUserLocation?: boolean
}

export const GeolocateControl: FC<GeolocateControlProps> = ({
  position = 'top-right',
  ...options
}) => {
  const { map } = useMap()
  const optionsString = JSON.stringify(options)

  useEffect(() => {
    const control = new maplibre.GeolocateControl({ ...JSON.parse(optionsString) })

    if (map) {
      map.addControl(control, position)
    }

    return () => {
      map?.removeControl(control)
    }
  }, [position, optionsString, map])

  return null
}

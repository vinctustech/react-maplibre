import { FC, useEffect } from 'react'
import maplibre, { GeolocateControlOptions } from 'maplibre-gl'
import { useMap } from './Map'
import { ControlPosition } from './types'

export type GeolocateControlProps = {
  position?: ControlPosition
  options?: GeolocateControlOptions
}

export const GeolocateControl: FC<GeolocateControlProps> = ({
  position = 'bottom-right' as ControlPosition,
  options = { showUserLocation: false },
}) => {
  const { map } = useMap()

  useEffect(() => {
    const control = new maplibre.GeolocateControl(options)

    if (map && position) {
      map.addControl(control, position)
    }

    return () => {
      try {
        map?.removeControl(control)
      } catch {
        // Map might be destroyed already, ignore cleanup errors
      }
    }
  }, [position, options, map])

  return null
}

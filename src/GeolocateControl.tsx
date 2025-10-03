import { FC, useContext, useEffect } from 'react'
import maplibre, { GeolocateControlOptions, ControlPosition } from 'maplibre-gl'
import { MapContext } from './Map'

export type GeolocateControlProps = {
  position?: ControlPosition
  options?: GeolocateControlOptions
}

export const GeolocateControl: FC<GeolocateControlProps> = ({
  position = 'bottom-right',
  options = { showUserLocation: false },
}) => {
  const { map, mapLoaded } = useContext(MapContext)
  const optionsString = JSON.stringify(options || {})

  useEffect(() => {
    const control = new maplibre.GeolocateControl(JSON.parse(optionsString))

    if (map && mapLoaded && position) {
      map.addControl(control, position)
    }

    return () => {
      try {
        if (map && !map._removed && map.hasControl(control)) {
          map.removeControl(control)
        }
      } catch {
        console.warn('Error cleaning up GeolocateControl')
      }
    }
  }, [position, optionsString, map, mapLoaded])

  return null
}

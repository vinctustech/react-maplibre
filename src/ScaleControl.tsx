import { FC, useContext, useEffect } from 'react'
import maplibre, { ScaleControlOptions, ControlPosition } from 'maplibre-gl'

import { MapContext } from './Map'

export type ScaleControlProps = {
  position?: ControlPosition
  options?: ScaleControlOptions
}

export const ScaleControl: FC<ScaleControlProps> = ({ position = 'bottom-right', options }) => {
  const { map, mapLoaded } = useContext(MapContext)
  const optionsString = JSON.stringify(options || {})

  useEffect(() => {
    const control = new maplibre.ScaleControl(JSON.parse(optionsString))

    if (map && mapLoaded && position) {
      map.addControl(control, position)
    }

    return () => {
      try {
        if (map && !map._removed && map.hasControl(control)) {
          map.removeControl(control)
        }
      } catch {
        console.warn('Error cleaning up ScaleControl')
      }
    }
  }, [position, optionsString, map, mapLoaded])

  return null
}

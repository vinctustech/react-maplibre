import { FC, useContext, useEffect } from 'react'
import maplibre, { NavigationControlOptions, ControlPosition } from 'maplibre-gl'

import { MapContext } from './Map'

export type NavigationControlProps = {
  position?: ControlPosition
  options?: NavigationControlOptions
}

export const NavigationControl: FC<NavigationControlProps> = ({
  position = 'bottom-right',
  options = {
    showZoom: true,
    showCompass: false,
  },
}) => {
  const { map, mapLoaded } = useContext(MapContext)
  const optionsString = JSON.stringify(options || {})

  useEffect(() => {
    const control = new maplibre.NavigationControl(JSON.parse(optionsString))

    if (map && mapLoaded && position) {
      map.addControl(control, position)
    }

    return () => {
      try {
        if (map && !map._removed && map.hasControl(control)) {
          map.removeControl(control)
        }
      } catch {
        console.warn('Error cleaning up NavigationControl')
      }
    }
  }, [position, optionsString, map, mapLoaded])

  return null
}

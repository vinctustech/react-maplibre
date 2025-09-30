import { FC, useEffect } from 'react'
import maplibre, { NavigationControlOptions } from 'maplibre-gl'
import { useMap } from './Map'
import { ControlPosition } from './types'

export type NavigationControlProps = {
  position?: ControlPosition
  options?: NavigationControlOptions
}

export const NavigationControl: FC<NavigationControlProps> = ({
  position = 'bottom-right' as ControlPosition,
  options = {
    showZoom: true,
    showCompass: false,
  },
}) => {
  const { map } = useMap()

  useEffect(() => {
    const control = new maplibre.NavigationControl(options)

    if (map && position) {
      map.addControl(control, position)
    }

    return () => {
      if (map && map.hasControl(control)) {
        map.removeControl(control)
      }
    }
  }, [position, options, map])

  return null
}

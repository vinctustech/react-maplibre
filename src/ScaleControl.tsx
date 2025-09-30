import { FC, useEffect } from 'react'
import maplibre, { ScaleControlOptions } from 'maplibre-gl'
import { useMap } from './Map'
import { ControlPosition } from './types'

export type ScaleControlProps = {
  position?: ControlPosition
  options?: ScaleControlOptions
}

export const ScaleControl: FC<ScaleControlProps> = ({
  position = 'bottom-right' as ControlPosition,
  options,
}) => {
  const { map } = useMap()

  useEffect(() => {
    const control = new maplibre.ScaleControl(options)

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

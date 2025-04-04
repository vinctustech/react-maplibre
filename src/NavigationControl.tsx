import { FC, useEffect } from 'react'
import maplibre from 'maplibre-gl'
import { useMap } from './Map'
import { ControlPosition } from './types'

export type NavigationControlProps = {
  position?: ControlPosition
}

export const NavigationControl: FC<NavigationControlProps> = ({
  position = 'top-right' as ControlPosition,
  ...options
}) => {
  const { map } = useMap()
  const optionsString = JSON.stringify(options)

  useEffect(() => {
    const control = new maplibre.NavigationControl()

    if (map && position) {
      map.addControl(control, position)
    }

    return () => {
      map?.removeControl(control)
    }
  }, [position, optionsString, map])

  return null
}

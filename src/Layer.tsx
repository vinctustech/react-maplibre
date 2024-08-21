import { FC, useEffect } from 'react'
import { LayerSpecification, GeoJSONSource } from 'maplibre-gl'
import { useMap } from './Map'

export type LayerProps = {
  layer: Omit<LayerSpecification, 'source'>
  source: GeoJSONSource
}

export const Layer: FC<LayerProps> = ({ layer, source }) => {
  const { map, mapLoaded } = useMap()
  const layerString = JSON.stringify({ source: layer.id, ...layer })
  const sourceString = JSON.stringify(source)

  useEffect(() => {
    let added = false
    const parsedSource = JSON.parse(sourceString)
    const parsedLayer = JSON.parse(layerString)

    if (map && mapLoaded) {
      added = true
      map.addSource(parsedLayer.id, parsedSource) // when adding, the source must be added first, and then the layer
      map.addLayer(parsedLayer)
    }

    return () => {
      if (added) {
        map?.removeLayer(parsedLayer.id) // when removing, the layer must be removed first, and then the source
        map?.removeSource(parsedLayer.id)
      }
    }
  }, [layerString, sourceString, map, mapLoaded])

  return null
}

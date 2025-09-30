import { FC, useEffect } from 'react'
import { LayerSpecification, GeoJSONSourceSpecification } from 'maplibre-gl'
import { useMap } from './Map'

export type LayerProps = {
  layer: Omit<LayerSpecification, 'source'>
  source: GeoJSONSourceSpecification
}

export const Layer: FC<LayerProps> = ({ layer, source }) => {
  const { map, mapLoaded } = useMap()
  const layerString = JSON.stringify({ source: layer.id, ...layer })
  const sourceString = JSON.stringify(source)

  useEffect(() => {
    const parsedSource = JSON.parse(sourceString)
    const parsedLayer = JSON.parse(layerString)

    if (map && mapLoaded) {
      map.addSource(parsedLayer.id, parsedSource) // when adding, the source must be added first, and then the layer
      map.addLayer(parsedLayer)
    }

    return () => {
      if (map) {
        // Check if layer exists before removing
        if (map.getLayer(parsedLayer.id)) {
          map.removeLayer(parsedLayer.id) // when removing, the layer must be removed first, and then the source
        }

        // Check if source exists before removing
        if (map.getSource(parsedLayer.id)) {
          map.removeSource(parsedLayer.id)
        }
      }
    }
  }, [layerString, sourceString, map, mapLoaded])

  return null
}

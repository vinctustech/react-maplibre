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
    let added = false
    const parsedSource = JSON.parse(sourceString)
    const parsedLayer = JSON.parse(layerString)

    if (map && mapLoaded) {
      added = true
      map.addSource(parsedLayer.id, parsedSource) // when adding, the source must be added first, and then the layer
      map.addLayer(parsedLayer)
    }

    return () => {
      if (added && map) {
        try {
          // Check if layer exists before removing
          if (map.getLayer && map.getLayer(parsedLayer.id)) {
            map.removeLayer(parsedLayer.id) // when removing, the layer must be removed first, and then the source
          }
        } catch {
          // Layer might not exist or map might be destroyed
        }

        try {
          // Check if source exists before removing
          if (map.getSource && map.getSource(parsedLayer.id)) {
            map.removeSource(parsedLayer.id)
          }
        } catch {
          // Source might not exist or map might be destroyed
        }
      }
    }
  }, [layerString, sourceString, map, mapLoaded])

  return null
}

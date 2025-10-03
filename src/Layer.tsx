import { FC, useContext, useEffect } from 'react'
import { MapContext } from './Map'
import { GeoJSONSourceSpecification, LayerSpecification } from 'maplibre-gl'

export type LayerProps = {
  layer: Omit<LayerSpecification, 'source'>
  source: GeoJSONSourceSpecification
}

export const Layer: FC<LayerProps> = ({ layer, source }) => {
  const { map, mapLoaded } = useContext(MapContext)
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
      try {
        if (map && mapLoaded && !map._removed) {
          if (map.getLayer(parsedLayer.id)) {
            map.removeLayer(parsedLayer.id) // when removing, the layer must be removed first, and then the source
          }

          if (map.getSource(parsedLayer.id)) {
            map.removeSource(parsedLayer.id)
          }
        }
      } catch {
        console.warn('Error cleaning up Layer')
      }
    }
  }, [layerString, sourceString, map, mapLoaded])

  return null
}

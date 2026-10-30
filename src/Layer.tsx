import { FC, useContext, useEffect, useRef } from 'react'
import { MapContext } from './Map'
import maplibre, {
  GeoJSONSource,
  GeoJSONSourceSpecification,
  LayerSpecification,
} from 'maplibre-gl'

export type LayerProps = {
  layer: Omit<LayerSpecification, 'source'>
  source: GeoJSONSourceSpecification
}

type Properties = Record<string, unknown>

type LayerStrings = {
  layerStructureString: string
  paintString: string
  layoutString: string
  sourceOptionsString: string
  dataString: string
}

type AppliedLayer = {
  dataString: string
  paint: Properties
  layout: Properties
}

const addSourceAndLayer = (map: maplibre.Map, id: string, strings: LayerStrings): AppliedLayer => {
  const paint: Properties = JSON.parse(strings.paintString)
  const layout: Properties = JSON.parse(strings.layoutString)

  // The layer must be removed before its source, and the source added before its layer.
  if (map.getLayer(id)) {
    map.removeLayer(id)
  }

  if (map.getSource(id)) {
    map.removeSource(id)
  }

  map.addSource(id, {
    ...JSON.parse(strings.sourceOptionsString),
    data: JSON.parse(strings.dataString),
  })
  map.addLayer({ source: id, ...JSON.parse(strings.layerStructureString), paint, layout })

  return { dataString: strings.dataString, paint, layout }
}

const updateProperties = (
  previous: Properties,
  next: Properties,
  setProperty: (key: string, value: unknown) => void,
) => {
  const keys = new Set([...Object.keys(previous), ...Object.keys(next)])

  // A key missing from `next` is set to undefined, which resets it to the style default.
  keys.forEach((key) => {
    if (JSON.stringify(previous[key]) !== JSON.stringify(next[key])) {
      setProperty(key, next[key])
    }
  })
}

export const Layer: FC<LayerProps> = ({ layer, source }) => {
  const { map, mapLoaded } = useContext(MapContext)
  const { id } = layer
  const { paint, layout, ...layerStructure } = layer
  const { data, ...sourceOptions } = source
  const strings: LayerStrings = {
    layerStructureString: JSON.stringify(layerStructure),
    paintString: JSON.stringify(paint ?? {}),
    layoutString: JSON.stringify(layout ?? {}),
    sourceOptionsString: JSON.stringify(sourceOptions),
    dataString: JSON.stringify(data),
  }
  const { layerStructureString, paintString, layoutString, sourceOptionsString, dataString } =
    strings

  // Keeps the newest props available to the creation effect without making it depend on them, so
  // that data, paint and layout changes update the existing source and layer in place.
  const latest = useRef(strings)
  const applied = useRef<AppliedLayer | null>(null)

  latest.current = strings

  useEffect(() => {
    if (!map || !mapLoaded) {
      return
    }

    applied.current = addSourceAndLayer(map, id, latest.current)

    return () => {
      try {
        if (!map._removed) {
          if (map.getLayer(id)) {
            map.removeLayer(id)
          }

          if (map.getSource(id)) {
            map.removeSource(id)
          }
        }
      } catch {
        console.warn('Error cleaning up Layer')
      }

      applied.current = null
    }
  }, [id, layerStructureString, sourceOptionsString, map, mapLoaded])

  useEffect(() => {
    const current = applied.current

    if (!map || !mapLoaded || !current) {
      return
    }

    // The source disappears when the map's style is replaced, so the source and layer are rebuilt
    // from the newest props.
    if (!map.getSource(id)) {
      try {
        applied.current = addSourceAndLayer(map, id, latest.current)
      } catch {
        console.warn('Error restoring Layer')
      }

      return
    }

    if (current.dataString !== dataString) {
      const geoJsonSource = map.getSource(id) as GeoJSONSource

      geoJsonSource.setData(JSON.parse(dataString))
      current.dataString = dataString
    }

    const nextPaint: Properties = JSON.parse(paintString)
    const nextLayout: Properties = JSON.parse(layoutString)

    updateProperties(current.paint, nextPaint, (key, value) =>
      map.setPaintProperty(id, key, value),
    )
    updateProperties(current.layout, nextLayout, (key, value) =>
      map.setLayoutProperty(id, key, value),
    )
    current.paint = nextPaint
    current.layout = nextLayout
  }, [id, dataString, paintString, layoutString, map, mapLoaded])

  return null
}

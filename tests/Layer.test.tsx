import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import type { LayerSpecification } from 'maplibre-gl'

import { asMap, FakeMap } from './fakeMaplibre'
import { MapContext } from '../src/Map'
import { Layer } from '../src/Layer'

vi.mock('maplibre-gl', async () => {
  const fake = await import('./fakeMaplibre')

  return fake.fakeMaplibreModule
})

type LayerTestProps = {
  map: FakeMap
  coordinates?: [number, number][]
  paint?: Record<string, unknown>
  layout?: Record<string, unknown>
  type?: 'line' | 'fill'
}

const line = (coordinates: [number, number][]) => ({
  type: 'Feature' as const,
  properties: {},
  geometry: { type: 'LineString' as const, coordinates },
})

const LayerOnMap = ({
  map,
  coordinates = [
    [-73.6, 45.5],
    [-73.5, 45.6],
  ],
  paint = { 'line-color': '#0000ff', 'line-width': 4 },
  layout = { 'line-cap': 'round' },
  type = 'line',
}: LayerTestProps) => (
  <MapContext.Provider value={{ map: asMap(map), mapLoaded: true }}>
    <Layer
      layer={{ id: 'route', type, paint, layout } as Omit<LayerSpecification, 'source'>}
      source={{ type: 'geojson', data: line(coordinates) }}
    />
  </MapContext.Provider>
)

describe('Layer', () => {
  afterEach(() => {
    cleanup()
  })

  it('adds the source before the layer', () => {
    const map = new FakeMap()

    render(<LayerOnMap map={map} />)

    expect(map.addSource).toHaveBeenCalledTimes(1)
    expect(map.addLayer).toHaveBeenCalledTimes(1)
    expect(map.addSource.mock.invocationCallOrder[0]).toBeLessThan(
      map.addLayer.mock.invocationCallOrder[0],
    )
  })

  it('updates the data in place', () => {
    const map = new FakeMap()
    const { rerender } = render(<LayerOnMap map={map} />)
    const source = map.sources.get('route')

    rerender(
      <LayerOnMap
        map={map}
        coordinates={[
          [-73.6, 45.5],
          [-73.4, 45.7],
        ]}
      />,
    )

    expect(map.addSource).toHaveBeenCalledTimes(1)
    expect(map.removeLayer).not.toHaveBeenCalled()
    expect(source?.setData).toHaveBeenCalledWith(
      line([
        [-73.6, 45.5],
        [-73.4, 45.7],
      ]),
    )
  })

  it('does nothing when re-rendered with equal props', () => {
    const map = new FakeMap()
    const { rerender } = render(<LayerOnMap map={map} />)

    rerender(<LayerOnMap map={map} />)

    expect(map.sources.get('route')?.setData).not.toHaveBeenCalled()
    expect(map.setPaintProperty).not.toHaveBeenCalled()
    expect(map.setLayoutProperty).not.toHaveBeenCalled()
  })

  it('sets changed paint keys and resets removed ones', () => {
    const map = new FakeMap()
    const { rerender } = render(<LayerOnMap map={map} />)

    rerender(<LayerOnMap map={map} paint={{ 'line-color': '#ff0000' }} />)

    expect(map.setPaintProperty).toHaveBeenCalledTimes(2)
    expect(map.setPaintProperty).toHaveBeenCalledWith('route', 'line-color', '#ff0000')
    expect(map.setPaintProperty).toHaveBeenCalledWith('route', 'line-width', undefined)
    expect(map.addLayer).toHaveBeenCalledTimes(1)
  })

  it('sets changed layout keys', () => {
    const map = new FakeMap()
    const { rerender } = render(<LayerOnMap map={map} />)

    rerender(<LayerOnMap map={map} layout={{ 'line-cap': 'butt' }} />)

    expect(map.setLayoutProperty).toHaveBeenCalledWith('route', 'line-cap', 'butt')
    expect(map.addLayer).toHaveBeenCalledTimes(1)
  })

  it('rebuilds the layer when its structure changes', () => {
    const map = new FakeMap()
    const { rerender } = render(<LayerOnMap map={map} />)

    rerender(<LayerOnMap map={map} type="fill" paint={{}} layout={{}} />)

    expect(map.removeLayer).toHaveBeenCalledWith('route')
    expect(map.addLayer).toHaveBeenCalledTimes(2)
    expect(map.layers.get('route')?.type).toBe('fill')
  })

  it('rebuilds the source and layer after a style swap removed them', () => {
    const map = new FakeMap()
    const { rerender } = render(<LayerOnMap map={map} />)

    map.replaceStyle()
    rerender(<LayerOnMap map={map} paint={{ 'line-color': '#ff0000' }} />)

    expect(map.addSource).toHaveBeenCalledTimes(2)
    expect(map.layers.get('route')?.paint).toEqual({ 'line-color': '#ff0000' })
  })

  it('skips updates against a removed map', () => {
    const map = new FakeMap()
    const { rerender } = render(<LayerOnMap map={map} />)

    map.remove()

    expect(() =>
      rerender(<LayerOnMap map={map} paint={{ 'line-color': '#ff0000' }} />),
    ).not.toThrow()
    expect(map.setPaintProperty).not.toHaveBeenCalled()
  })

  it('removes the layer before the source when unmounted', () => {
    const map = new FakeMap()
    const { unmount } = render(<LayerOnMap map={map} />)

    unmount()

    expect(map.layers.size).toBe(0)
    expect(map.sources.size).toBe(0)
    expect(map.removeLayer.mock.invocationCallOrder[0]).toBeLessThan(
      map.removeSource.mock.invocationCallOrder[0],
    )
  })
})

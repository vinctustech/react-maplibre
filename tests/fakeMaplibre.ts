import { vi } from 'vitest'
import type maplibre from 'maplibre-gl'

type Listener = () => void

class Evented {
  private listeners = new Map<string, Set<Listener>>()

  on(type: string, listener: Listener) {
    const listeners = this.listeners.get(type) ?? new Set<Listener>()

    listeners.add(listener)
    this.listeners.set(type, listeners)

    return this
  }

  off(type: string, listener: Listener) {
    this.listeners.get(type)?.delete(listener)

    return this
  }

  fire(type: string) {
    this.listeners.get(type)?.forEach((listener) => listener())
  }
}

export class FakeSource {
  constructor(public data: unknown) {}

  setData = vi.fn((data: unknown) => {
    this.data = data
  })
}

/** Behaves like a MapLibre map for the calls the components make, including throwing once removed. */
export class FakeMap extends Evented {
  _removed = false
  sources = new Map<string, FakeSource>()
  layers = new Map<string, Record<string, unknown>>()

  private throwIfRemoved() {
    if (this._removed) {
      throw new TypeError("Cannot read properties of undefined (reading 'getSource')")
    }
  }

  getSource = vi.fn((id: string) => {
    this.throwIfRemoved()

    return this.sources.get(id)
  })

  getLayer = vi.fn((id: string) => {
    this.throwIfRemoved()

    return this.layers.get(id)
  })

  addSource = vi.fn((id: string, specification: { data: unknown }) => {
    this.throwIfRemoved()
    this.sources.set(id, new FakeSource(specification.data))
  })

  addLayer = vi.fn((layer: Record<string, unknown> & { id: string }) => {
    this.throwIfRemoved()
    this.layers.set(layer.id, layer)
  })

  removeLayer = vi.fn((id: string) => {
    this.throwIfRemoved()
    this.layers.delete(id)
  })

  removeSource = vi.fn((id: string) => {
    this.throwIfRemoved()
    this.sources.delete(id)
  })

  setPaintProperty = vi.fn(() => this.throwIfRemoved())

  setLayoutProperty = vi.fn(() => this.throwIfRemoved())

  replaceStyle() {
    this.sources.clear()
    this.layers.clear()
  }

  remove() {
    this._removed = true
    this.fire('remove')
  }
}

export class FakePopup extends Evented {
  static instances: FakePopup[] = []

  map: FakeMap | null = null

  constructor(public options: Record<string, unknown>) {
    super()
    FakePopup.instances.push(this)
  }

  setLngLat = vi.fn(() => this)

  setHTML = vi.fn(() => this)

  // A MapLibre popup closes itself when its map is removed.
  addTo(map: FakeMap) {
    this.map = map
    map.on('remove', this.remove)

    return this
  }

  remove = () => {
    if (!this.map) {
      return this
    }

    this.map.off('remove', this.remove)
    this.map = null
    this.fire('close')

    return this
  }
}

export const fakeMaplibreModule = { default: { Popup: FakePopup } }

// The components take a MapLibre map from context; the fake implements only what they call.
export const asMap = (fake: FakeMap) => fake as unknown as maplibre.Map

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render } from '@testing-library/react'

import { asMap, FakeMap, FakePopup } from './fakeMaplibre'
import { MapContext } from '../src/Map'
import { Popup } from '../src/Popup'

vi.mock('maplibre-gl', async () => {
  const fake = await import('./fakeMaplibre')

  return fake.fakeMaplibreModule
})

type PopupTestProps = {
  map: FakeMap
  longitude?: number
  latitude?: number
  text?: string
  className?: string
  onClose?: () => void
}

const PopupOnMap = ({
  map,
  longitude = -73.6,
  latitude = 45.5,
  text = 'Atwater Station',
  className,
  onClose,
}: PopupTestProps) => (
  <MapContext.Provider value={{ map: asMap(map), mapLoaded: true }}>
    <Popup longitude={longitude} latitude={latitude} className={className} onClose={onClose}>
      <div>{text}</div>
    </Popup>
  </MapContext.Provider>
)

describe('Popup', () => {
  beforeEach(() => {
    FakePopup.instances = []
  })

  afterEach(() => {
    cleanup()
  })

  it('creates one popup and moves and updates it in place', () => {
    const map = new FakeMap()
    const { rerender } = render(<PopupOnMap map={map} />)

    rerender(<PopupOnMap map={map} longitude={-73.7} latitude={45.6} text="Westmount Terminal" />)

    expect(FakePopup.instances).toHaveLength(1)

    const [popup] = FakePopup.instances

    expect(popup.setLngLat).toHaveBeenLastCalledWith([-73.7, 45.6])
    expect(popup.setHTML).toHaveBeenLastCalledWith('<div>Westmount Terminal</div>')
  })

  it('does not reset the content when only the children identity changes', () => {
    const map = new FakeMap()
    const { rerender } = render(<PopupOnMap map={map} />)
    const [popup] = FakePopup.instances
    const callsAfterMount = popup.setHTML.mock.calls.length

    rerender(<PopupOnMap map={map} />)

    expect(popup.setHTML).toHaveBeenCalledTimes(callsAfterMount)
  })

  it('recreates the popup when an option changes', () => {
    const map = new FakeMap()
    const { rerender } = render(<PopupOnMap map={map} />)

    rerender(<PopupOnMap map={map} className="dark" />)

    expect(FakePopup.instances).toHaveLength(2)
    expect(FakePopup.instances[0].map).toBeNull()
    expect(FakePopup.instances[1].options.className).toBe('dark')
  })

  it('reports a close by the user', () => {
    const map = new FakeMap()
    const onClose = vi.fn()

    render(<PopupOnMap map={map} onClose={onClose} />)
    FakePopup.instances[0].remove()

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not report a close when unmounted', () => {
    const map = new FakeMap()
    const onClose = vi.fn()
    const { unmount } = render(<PopupOnMap map={map} onClose={onClose} />)

    unmount()

    expect(FakePopup.instances[0].map).toBeNull()
    expect(onClose).not.toHaveBeenCalled()
  })

  it('does not report a close when its map is removed', () => {
    const map = new FakeMap()
    const onClose = vi.fn()

    render(<PopupOnMap map={map} onClose={onClose} />)
    map.remove()

    expect(onClose).not.toHaveBeenCalled()
  })
})

Map
===

*Map* is the React component that wraps a Mapbox GL JS [Map](https://docs.mapbox.com/mapbox-gl-js/api/map/).

```javascript
import React, { FC } from 'react'
import { Map, MapProvider, Marker, GeolocateControl } from '@vinctus/react-maplibre'

const accessToken = '<Mapbox access token>'

export const App: FC = () => {
  return (
    <MapProvider>
      <Map
        style={{ height: '100vh' }}
        longitude={-73.597449290552}
        latitude={45.498740109868166}
        zoom={14}
        accessToken={accessToken}
      />
    </MapProvider>
  )
}
```

Map Object
----------

The *Map* object can be accessed via a [React Ref](https://reactjs.org/docs/refs-and-the-dom.html) or the [useMap](html/api/usemap) hook. The Mapbox Map instance is returned in either case provided access to instance members.

Props
-----

### General

#### `accessToken` string

Mapbox access token.

#### `fallback` ReactNode *(optional)*

Error boundary fallback. If no fallback is provided, `<h1>Sorry.. there was a map error</h1>` is used instead.

#### `id` string *(optional)*

Map container id.

#### `ref` RefAttributes<maplibregl.Map | null> *(optional)*

Forwarded ref.

### Layout

#### `style` CSSProperties *(optional)*

Default: `{position: 'relative', width: '100%', height: '100%'}`

Map container CSS.

### Camera

#### `longitude` number

Initial map center longitude.

#### `latitude` number

Initial map center longitude.

#### `zoom` number

Initial map zoom.

### Styling

#### `antialias` boolean *(optional)*

Mapbox [Map](https://docs.mapbox.com/mapbox-gl-js/api/map/) `antialias` option.

#### `logoPosition` 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' *(optional)*

Position of the Mapbox wordmark on the map.

#### `maxPitch` number *(optional)*

The pitch is disabled (zero value) by default.

#### `mapStyle` string *(optional)*

The current map style default is `mapbox://styles/mapbox/streets-v11`.

### Events

#### `onLoad` (e: import('maplibre-gl').MapboxEvent) => void *(optional)*

Mapbox `map.on('load',...)` event callback.

#### `onDragEnd` (e: ViewStateChangeEvent) => void *(optional)*

Mapbox `map.on('dragend',...)` event callback.

#### `onMoveEnd` (e: ViewStateChangeEvent) => void *(optional)*

Mapbox `map.on('moveend',...)` event callback.

#### `onZoomEnd` (e: ViewStateChangeEvent) => void *(optional)*

Mapbox `map.on('zoomend',...)` event callback.

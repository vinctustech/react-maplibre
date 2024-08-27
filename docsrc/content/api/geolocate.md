GeolocateControl
================

A Component that adds a [GeolocateControl](https://docs.mapbox.com/mapbox-gl-js/api/markers/#geolocatecontrol) to a map.

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
      >
        <GeolocateControl />
      </Map>
    </MapProvider>
  )
}
```

Props
-----

#### `position` 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' *(optional)*

The position on the map where the control will be added. Defaults to `top-right`.

#### `showUserLocation` boolean *(optional)*

Set to `false` to disable the blue dot that shows the user's position.

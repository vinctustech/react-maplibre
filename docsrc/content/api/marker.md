Marker
======

A component that adds a [Marker](https://docs.mapbox.com/mapbox-gl-js/api/markers/#marker) to a map. A simple marker with no child appears as a light blue droplet shaped SVG.  Otherwise, an arbitrary React element child can be used as the marker.

[//]: # (TODO: tsx support)

```javascript
import React, { FC } from 'react'
import { Map, MapProvider, Marker } from '@vinctus/react-maplibre'

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
        <Marker longitude={-73.597449290552} latitude={45.498740109868166}>
          <p>Custom Marker</p>
          <svg style={{ marginLeft: 'auto', marginRight: 'auto' }} width="20" height="20">
            <circle cx="10" cy="10" r="9" stroke="green" strokeWidth="2" fill="yellow" />
            Sorry, your browser does not support inline SVG.
          </svg>
        </Marker>
      </Map>
    </MapProvider>
  )
}
```

Props
-----

#### `longitude` number

The longitude of the marker.

#### `latitude` number

The latitude of the marker.

#### `popup` ReactElement *(optional)*

An optional popup to appear when the marker is clicked on.

#### `closeOnClick` boolean *(optional)*

Whether the popup (if there is one) will close if clicked on.

#### `anchor` string *(optional)*

Indicates which part of the marker should be positioned at the coordinates. The choices are `center`, `top`, `bottom`, `left`, `right`, `top-left`, `top-right`, `bottom-left`, and `bottom-right`. 

#### `color` string *(optional)*

The marker color.

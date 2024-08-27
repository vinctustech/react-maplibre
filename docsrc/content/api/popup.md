Popup
=====

A component that adds a [Popup](https://docs.mapbox.com/mapbox-gl-js/api/markers/#popup) to a map.

```javascript
import React, { FC } from 'react'
import { Map, MapProvider, Popup } from '@vinctus/react-maplibre'

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
        <Popup longitude={-73.597449290552} latitude={45.498740109868166}>
          <div>Beaver Lake</div>
        </Popup>
      </Map>
    </MapProvider>
  )
}
```

Props
-----

#### `longitude` number

The longitude of the popup.

#### `latitude` number

The latitude of the popup.

#### `className` string *(optional)*

Option CSS classes that are added to the popup container.

#### `closeOnClick` boolean *(optional)*

If `true`, the popup will close when the map is clicked on.

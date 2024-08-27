Getting Started
===============

Installation
------------

Using *react-maplibre* requires [React.js](https://reactjs.org/) >= 18.  The [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/guides/) library must also be installed.

```
npm install maplibre-gl @vinctus/react-maplibre
```

Example
-------

```javascript
import React, { FC } from 'react'
import ReactDOM from 'react-dom'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Map, MapProvider, Marker } from '@vinctus/react-maplibre'

const accessToken = '<Mapbox access token>'

ReactDOM.render(
    <React.StrictMode>
      <MapProvider>
        <Map
          style={{ height: '100vh' }}
          longitude={-73.597449290552}
          latitude={45.498740109868166}
          zoom={14}
          accessToken={accessToken}
        />
      </MapProvider>
    </React.StrictMode>,
    document.getElementById('root')
)
```

[= note =]
  Stylesheet `maplibre-gl/dist/maplibre-gl.css` must be imported.
[= /note =]

Getting Started
===============

Installation
------------

Using *react-mapbox* requires [React.js](https://reactjs.org/) >= 18.  The [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/guides/) library must also be installed.

```
npm install mapbox-gl @vinctus/react-mapbox
```

Example
-------

```javascript
import React, { FC } from 'react'
import ReactDOM from 'react-dom'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Map, MapProvider, Marker } from '@vinctus/react-mapbox'

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
  Stylesheet `mapbox-gl/dist/mapbox-gl.css` must be imported.
[= /note =]

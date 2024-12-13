import React, { useRef, useState } from 'react'
import {
  Map,
  Marker,
  MapProvider,
  ViewState,
  Layer,
  Popup,
  GeolocateControl,
  ScaleControl,
} from '@vinctus/react-maplibre'
import maplibre from 'maplibre-gl'
import { createGeoJSONCircle } from './util'
import './Home.css'

export default function Home() {
  const [info, setInfo] = useState<{ view: ViewState; events: string[] }>({
    view: { longitude: 0, latitude: 0, zoom: 0 },
    events: [],
  })
  const [marker, setMarker] = useState(true)
  const [circle, setCircle] = useState(true)
  const [triangle, setTriangle] = useState(true)
  const [popup, setPopup] = useState(false)
  const [symbol, setSymbol] = useState(true)
  const [error, setError] = useState(false)
  const map = useRef<maplibre.Map>(null)

  return (
    <MapProvider>
      <div className="container">
        <div className="info">
          {info && (
            <p>
              Center: {info.view.longitude.toFixed(4)}, {info.view.latitude.toFixed(4)} |
              Zoom: {info.view.zoom.toFixed(4)}
            </p>
          )}
        </div>

        <div className="map-container">
          <Map
            ref={map}
            longitude={-73.57529502748406}
            latitude={45.46566080452946}
            zoom={14}
            onMoveEnd={(ev) => {
              setInfo((info) => ({
                view: ev.viewState,
                events: [...info.events, 'moveend'],
              }))
            }}
            onLoad={async (ev) => {
              const map = ev.target
              const viewState = {
                longitude: map.getCenter().lng,
                latitude: map.getCenter().lat,
                zoom: map.getZoom(),
              }

              map.scrollZoom.setWheelZoomRate(1)

              if (!map.hasImage('blue-dot')) {
                const image = await map.loadImage('/solid-blue-15-dot.png') // Note the leading slash for public directory
                map.addImage('blue-dot', image.data)
              }

              setInfo((info) => ({
                view: viewState,
                events: [...info.events, 'load'],
              }))
            }}
          >
            {error && ({} as React.ReactNode)}

            <GeolocateControl position="bottom-right" showUserLocation={false} />
            <ScaleControl position="bottom-right" />

            {marker && (
              <Marker
                longitude={-73.57529502748406}
                latitude={45.46566080452946}
                popup={<p>This is a marker popup</p>}
                closeOnClick={false}
              >
                <div className="marker">This is a marker</div>
              </Marker>
            )}

            {circle && (
              <Layer
                layer={{
                  id: 'circleLayer',
                  type: 'line',
                  layout: {
                    'line-join': 'round',
                    'line-cap': 'round',
                  },
                  paint: {
                    'line-color': '#8c8c8c',
                    'line-width': 4,
                    'line-opacity': 0.7,
                  },
                }}
                source={{
                  type: 'geojson',
                  data: {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                      type: 'LineString',
                      coordinates: createGeoJSONCircle(
                        -73.57529502748406,
                        45.46566080452946,
                        0.5,
                        64,
                      ),
                    },
                  },
                }}
              />
            )}

            {triangle && (
              <Layer
                layer={{
                  id: 'triangleLayer',
                  type: 'fill',
                  paint: {
                    'fill-color': 'green',
                    'fill-opacity': 0.7,
                  },
                }}
                source={{
                  type: 'geojson',
                  data: {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                      type: 'Polygon',
                      coordinates: [
                        [
                          [-73.5775158966358, 45.46620256775412],
                          [-73.57352476946453, 45.46512656069532],
                          [-73.57690435295633, 45.4639000380907],
                        ],
                      ],
                    },
                  },
                }}
              />
            )}

            {symbol && (
              <Layer
                layer={{
                  id: 'symbolLayer',
                  type: 'symbol',
                  layout: {
                    'icon-image': 'blue-dot',
                    'icon-size': 0.6,
                    'symbol-placement': 'line',
                    'symbol-spacing': 20,
                    'icon-allow-overlap': true,
                  },
                }}
                source={{
                  type: 'geojson',
                  data: {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                      type: 'LineString',
                      coordinates: [
                        [-73.5775158966358, 45.46620256775412],
                        [-73.57352476946453, 45.46512656069532],
                        [-73.57690435295633, 45.4639000380907],
                      ],
                    },
                  },
                }}
              />
            )}

            {popup && (
              <Popup
                longitude={-73.57604400241011}
                latitude={45.4622652132226}
                closeOnClick={false}
              >
                <div>This is a popup</div>
              </Popup>
            )}
          </Map>
        </div>

        <div className="controls">
          <button onClick={() => setMarker((on) => !on)}>
            {marker ? 'Hide marker' : 'Show marker'}
          </button>
          <button onClick={() => setCircle((on) => !on)}>
            {circle ? 'Hide circle' : 'Show circle'}
          </button>
          <button onClick={() => setTriangle((on) => !on)}>
            {triangle ? 'Hide triangle' : 'Show triangle'}
          </button>
          <button onClick={() => setPopup((on) => !on)}>
            {popup ? 'Hide popup' : 'Show popup'}
          </button>
          <button onClick={() => setSymbol((on) => !on)}>
            {symbol ? 'Hide symbol' : 'Show symbol'}
          </button>
          <button disabled={error} onClick={() => setError(true)}>
            Trigger error
          </button>
        </div>

        <div className="events">
          <ul>
            {info.events.map((e, idx) => (
              <li key={idx}>{e}</li>
            ))}
          </ul>
        </div>
      </div>
    </MapProvider>
  )
}
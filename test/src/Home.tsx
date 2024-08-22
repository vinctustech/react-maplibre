import { FC, ReactNode, useRef, useState } from 'react'
import {
  Map,
  Marker,
  MapProvider,
  viewStateFromMap,
  ViewState,
  Layer,
  Popup,
  GeolocateControl,
  ScaleControl,
} from '@vinctus/react-maplibre'
import {
  ThemeProvider,
  Card,
  ModeProvider,
  ModeSwitcher,
  Text,
  Grid,
  Elem,
  Button,
} from '@edadma/react-tailwind'
import { useNavigate } from 'react-router-dom'
import { createGeoJSONCircle } from './util'
import maplibre from 'maplibre-gl'

export const Home: FC = () => {
  const [info, setInfo] = useState<{ view: ViewState; events: string[] }>({
    view: { longitude: 0, latitude: 0, zoom: 0 },
    events: [],
  })
  const navigate = useNavigate()
  const [marker, setMarker] = useState(true)
  const [circle, setCircle] = useState(true)
  const [triangle, setTriangle] = useState(true)
  const [popup, setPopup] = useState(false)
  const [symbol, setSymbol] = useState(true)
  const [error, setError] = useState(false)
  const map = useRef<maplibre.Map>(null)

  return (
    <ThemeProvider>
      <ModeProvider>
        <MapProvider>
          <Card border={false}>
            <ModeSwitcher />
            <Grid cols={2}>
              <Elem>
                {info && (
                  <Text>
                    center: {info.view.longitude.toFixed(4)}, {info.view.latitude.toFixed(4)} |
                    zoom: {info.view.zoom.toFixed(4)}
                  </Text>
                )}
                <div
                  className="border-4 border-indigo-700"
                  style={{ width: '100%', height: '400px' }}
                >
                  <Map
                    fallback={
                      <Text size="xl" weight="bold">
                        This is the error boundary fallback
                      </Text>
                    }
                    ref={map}
                    longitude={-73.57529502748406}
                    latitude={45.46566080452946}
                    zoom={14}
                    onMoveEnd={(ev) => {
                      navigate(
                        `${window.location.pathname}?latitude=${ev.viewState.latitude}&longitude=${ev.viewState.longitude}`,
                      )
                      setInfo((info) => ({
                        view: ev.viewState,
                        events: [...info.events, 'moveend'],
                      }))
                    }}
                    onLoad={async (ev) => {
                      const map = ev.target
                      const viewState = viewStateFromMap(ev.target)

                      map.scrollZoom.setWheelZoomRate(1)

                      if (!map.hasImage('blue-dot')) {
                        const image = await map.loadImage(`solid-blue-15-dot.png`)

                        map.addImage('blue-dot', image.data)
                      }

                      navigate(
                        `${window.location.pathname}?latitude=${viewState.latitude}&longitude=${viewState.longitude}`,
                      )
                      setInfo((info) => ({
                        view: viewState,
                        events: [...info.events, 'load'],
                      }))
                    }}
                  >
                    {error && ({} as ReactNode)}
                    <GeolocateControl position="bottom-right" showUserLocation={false} />
                    <ScaleControl position="bottom-right" />
                    {marker && (
                      <Marker
                        longitude={-73.57529502748406}
                        latitude={45.46566080452946}
                        popup={<p>This is a marker popup</p>}
                        closeOnClick={false}
                      >
                        <p>This is a marker</p>
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
              </Elem>
              <Elem>
                {info && (
                  <ul>
                    {info.events.map((e, idx) => (
                      <li key={idx}>
                        <Text>{e}</Text>
                      </li>
                    ))}
                  </ul>
                )}
              </Elem>
              <Elem>
                <Button onClick={() => setMarker((on) => !on)}>
                  {marker ? 'no marker' : 'show marker'}
                </Button>{' '}
                <Button onClick={() => setCircle((on) => !on)}>
                  {circle ? 'no circle' : 'show circle'}
                </Button>{' '}
                <Button onClick={() => setTriangle((on) => !on)}>
                  {triangle ? 'no triangle' : 'show triangle'}
                </Button>{' '}
                <Button onClick={() => setPopup((on) => !on)}>
                  {popup ? 'no popup' : 'show popup'}
                </Button>{' '}
                <Button onClick={() => setSymbol((on) => !on)}>
                  {symbol ? 'no symbol' : 'show symbol'}
                </Button>{' '}
                <Button disabled={error} onClick={() => setError((on) => !on)}>
                  error
                </Button>
              </Elem>
            </Grid>
          </Card>
        </MapProvider>
      </ModeProvider>
    </ThemeProvider>
  )
}

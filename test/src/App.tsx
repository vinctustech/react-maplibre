import { Map, MapProvider } from '@vinctus/react-maplibre'
import './App.css'

export default function App() {
  return (
    <MapProvider>
      <div className="map-container">
        <Map
          longitude={-73.57529502748406}
          latitude={45.46566080452946}
          zoom={14}
          onLoad={(e) => {
            console.log('Map loaded', e)
          }}
        />
      </div>
    </MapProvider>
  )
}

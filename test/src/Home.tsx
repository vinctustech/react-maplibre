import { useRef, useCallback } from 'react'
import { Map, GeolocateControl, ScaleControl, NavigationControl } from '@vinctus/react-maplibre'
import maplibre from 'maplibre-gl'
import './Home.css'

export default function Home() {
  const mapRef = useRef<maplibre.Map>(null)

  const onLoad = useCallback(() => {
    const map = mapRef.current

    if (map) {
      map.scrollZoom.setWheelZoomRate(1)
    }
  }, [])

  return (
    <div className="container">
      <div className="map-container">
        <Map
          ref={mapRef}
          longitude={-73.57529502748406}
          latitude={45.46566080452946}
          mapStyle="https://demotiles.maplibre.org/style.json"
          onLoad={onLoad}
        >
          <GeolocateControl />
          <ScaleControl />
          <NavigationControl />
        </Map>
      </div>
    </div>
  )
}

import { FC } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Home } from './Home'
import { Whatever } from './Whatever'
import { MapProvider } from '@vinctus/react-maplibre'

const App: FC = () => {
  return (
    <MapProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/whatever" element={<Whatever />} />
      </Routes>
    </MapProvider>
  )
}

export default App

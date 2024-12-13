import { FC } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Home } from './Home'

const App: FC = () => {
  console.log('Rendering test App')
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  )
}

export default App

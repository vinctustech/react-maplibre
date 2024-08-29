import { FC } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Home } from './Home'
import { Whatever } from './Whatever'

const App: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/whatever" element={<Whatever />} />
    </Routes>
  )
}

export default App

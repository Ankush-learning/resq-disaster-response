import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoadingScreen from './components/LoadingScreen'
import Navbar from './components/Navbar'
import CustomCursor from './components/CustomCursor'
import Home from './pages/Home'
import Login from './pages/Login'
import ReportEmergency from './pages/ReportEmergency'
import LiveMap from './pages/LiveMap'
import Dashboard from './pages/Dashboard'
import Resources from './pages/Resources'

export default function App() {
  const [loaded, setLoaded] = useState(false)

  if (!loaded) {
    return <LoadingScreen onComplete={() => setLoaded(true)} />
  }

  return (
    <BrowserRouter>
      <CustomCursor />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/report" element={<ReportEmergency />} />
        <Route path="/map" element={<LiveMap />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resources" element={<Resources />} />
      </Routes>
    </BrowserRouter>
  )
}

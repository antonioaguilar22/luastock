import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Login from './pages/Login'
import Productos from './pages/Productos'
import ProductoForm from './pages/ProductoForm'
import Dashboard from './pages/Dashboard'
import MovimientoForm from './pages/MovimientoForm'
import Reportes from './pages/Reportes'
import PrivateRoute from './components/PrivateRoute'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/productos" element={<PrivateRoute><Productos /></PrivateRoute>} />
        <Route path="/productos/nuevo" element={<PrivateRoute><ProductoForm /></PrivateRoute>} />
        <Route path="/productos/editar/:id" element={<PrivateRoute><ProductoForm /></PrivateRoute>} />
        <Route path="/movimientos/nuevo" element={<PrivateRoute><MovimientoForm /></PrivateRoute>} />
        <Route path="/reportes" element={<PrivateRoute><Reportes /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
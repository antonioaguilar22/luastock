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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/productos/nuevo" element={<ProductoForm />} />
        <Route path="/productos/editar/:id" element={<ProductoForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/movimientos/nuevo" element={<MovimientoForm />} />
        <Route path="/reportes" element={<Reportes />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
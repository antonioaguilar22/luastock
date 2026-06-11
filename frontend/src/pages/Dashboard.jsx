import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, Package, ArrowLeftRight, BarChart2, LogOut } from 'lucide-react'
import api from '../services/api'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const mensaje = location.state?.mensaje

  useEffect(() => {
    cargarDashboard()
  }, [])

  const cargarDashboard = async () => {
    try {
      const response = await api.get('/dashboard')
      setData(response.data)
    } catch (err) {
      console.error('Error al cargar dashboard:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  const handleNavegar = (ruta) => {
    setMenuAbierto(false)
    navigate(ruta)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F0FF' }}>
      <p style={{ color: '#2D1B4E' }}>Cargando...</p>
    </div>
  )

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F0FF' }}>

      {/* Header */}
      <div className="px-4 py-4 flex items-center justify-between" style={{ backgroundColor: '#2D1B4E' }}>
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide">LuaStock</h1>
          <p className="text-xs" style={{ color: '#C4B5E8' }}>Lua Skin Care</p>
        </div>
        <button
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="hover:opacity-80 transition-opacity p-1"
          style={{ color: '#C4B5E8' }}
        >
          {menuAbierto ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Menú hamburguesa desplegable */}
      {menuAbierto && (
        <div className="shadow-lg" style={{ backgroundColor: '#3B2A6E' }}>
          <button
            onClick={() => handleNavegar('/productos')}
            className="w-full flex items-center gap-3 px-6 py-4 hover:opacity-80 transition-opacity border-b"
            style={{ borderColor: '#4C3A82' }}
          >
            <Package size={20} color="#C4B5E8" />
            <div className="text-left">
              <p className="text-white text-sm font-medium">Inventario</p>
              <p className="text-xs" style={{ color: '#C4B5E8' }}>Gestiona tu catálogo de productos</p>
            </div>
          </button>
          <button
            onClick={() => handleNavegar('/movimientos/nuevo')}
            className="w-full flex items-center gap-3 px-6 py-4 hover:opacity-80 transition-opacity border-b"
            style={{ borderColor: '#4C3A82' }}
          >
            <ArrowLeftRight size={20} color="#C4B5E8" />
            <div className="text-left">
              <p className="text-white text-sm font-medium">Registrar movimiento</p>
              <p className="text-xs" style={{ color: '#C4B5E8' }}>Registra entradas y salidas de stock</p>
            </div>
          </button>
          <button
            onClick={() => handleNavegar('/reportes')}
            className="w-full flex items-center gap-3 px-6 py-4 hover:opacity-80 transition-opacity border-b"
            style={{ borderColor: '#4C3A82' }}
          >
            <BarChart2 size={20} color="#C4B5E8" />
            <div className="text-left">
              <p className="text-white text-sm font-medium">Reportes</p>
              <p className="text-xs" style={{ color: '#C4B5E8' }}>Consulta el historial de movimientos</p>
            </div>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-6 py-4 hover:opacity-80 transition-opacity"
          >
            <LogOut size={20} color="#F87171" />
            <div className="text-left">
              <p className="text-sm font-medium" style={{ color: '#F87171' }}>Cerrar sesión</p>
            </div>
          </button>
        </div>
      )}

      <div className="max-w-lg mx-auto p-4 space-y-4">

        {/* Mensaje de confirmación */}
        {mensaje && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
            ✓ {mensaje}
          </div>
        )}

        {/* Saludo */}
        <p className="text-sm font-medium" style={{ color: '#2D1B4E' }}>
          ¡Hola, {user.nombre}! 👋
        </p>

        {/* Métricas */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl shadow-sm p-3 text-center border border-purple-100">
            <p className="text-2xl font-bold" style={{ color: '#2D1B4E' }}>{data.total_productos}</p>
            <p className="text-xs font-medium text-gray-600 mt-1">Productos</p>
            <p className="text-xs text-gray-400 mt-0.5">en catálogo</p>
          </div>
          <div className={`rounded-xl shadow-sm p-3 text-center border ${
            data.total_stock_bajo > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-purple-100'
          }`}>
            <p className={`text-2xl font-bold ${data.total_stock_bajo > 0 ? 'text-red-500' : ''}`}
              style={data.total_stock_bajo === 0 ? { color: '#2D1B4E' } : {}}>
              {data.total_stock_bajo}
            </p>
            <p className="text-xs font-medium text-gray-600 mt-1">Stock bajo</p>
            <p className="text-xs text-gray-400 mt-0.5">requieren atención</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-3 text-center border border-purple-100">
            <p className="text-2xl font-bold" style={{ color: '#2D1B4E' }}>{data.movimientos_hoy}</p>
            <p className="text-xs font-medium text-gray-600 mt-1">Movimientos</p>
            <p className="text-xs text-gray-400 mt-0.5">registrados hoy</p>
          </div>
        </div>

        {/* Alertas de stock bajo */}
        {data.productos_stock_bajo.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-4 border border-red-100">
            <div className="flex items-center gap-2 mb-3">
              <span>⚠️</span>
              <div>
                <h2 className="font-semibold text-sm text-red-600">Alertas de stock bajo</h2>
                <p className="text-xs text-gray-400">Estos productos necesitan reabastecerse pronto</p>
              </div>
            </div>
            <div className="space-y-2">
              {data.productos_stock_bajo.map(producto => (
                <div key={producto.id} className="flex items-center justify-between bg-red-50 rounded-lg px-3 py-2">
                  <span className="text-sm text-gray-800">{producto.nombre}</span>
                  <span className="text-sm font-bold text-red-500">{producto.stock} uds.</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instrucción */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-purple-100">
          <p className="text-sm font-medium" style={{ color: '#2D1B4E' }}>¿Qué deseas hacer?</p>
          <p className="text-xs text-gray-400 mt-1">Usa el menú <span className="font-medium" style={{ color: '#2D1B4E' }}>☰</span> en la parte superior para navegar entre las secciones del sistema.</p>
        </div>

      </div>
    </div>
  )
}
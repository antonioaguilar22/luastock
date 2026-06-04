import { Package, ArrowLeftRight, BarChart2, AlertTriangle, Hand } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useLocation } from 'react-router-dom'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
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
          onClick={handleLogout}
          className="text-sm hover:opacity-80 transition-opacity"
          style={{ color: '#C4B5E8' }}
        >
          Cerrar sesión
        </button>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-4">

        {/* Saludo */}
        <p className="text-sm font-medium" style={{ color: '#2D1B4E' }}>
          <Hand size={16} className="inline mr-1" color="#2D1B4E" />
          ¡Hola, {user.nombre}!
          {mensaje && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
              ✓ {mensaje}
            </div>
          )}
        </p>

        {/* Métricas */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl shadow-sm p-3 text-center border border-purple-100">
            <p className="text-2xl font-bold" style={{ color: '#2D1B4E' }}>{data.total_productos}</p>
            <p className="text-xs text-gray-500 mt-1">Productos</p>
          </div>
          <div className={`rounded-xl shadow-sm p-3 text-center border ${data.total_stock_bajo > 0
            ? 'bg-red-50 border-red-200'
            : 'bg-white border-purple-100'
            }`}>
            <p className={`text-2xl font-bold ${data.total_stock_bajo > 0 ? 'text-red-500' : ''
              }`} style={data.total_stock_bajo === 0 ? { color: '#2D1B4E' } : {}}>
              {data.total_stock_bajo}
            </p>
            <p className="text-xs text-gray-500 mt-1">Stock bajo</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-3 text-center border border-purple-100">
            <p className="text-2xl font-bold" style={{ color: '#2D1B4E' }}>{data.movimientos_hoy}</p>
            <p className="text-xs text-gray-500 mt-1">Mov. hoy</p>
          </div>
        </div>

        {/* Alertas de stock bajo */}
        {data.productos_stock_bajo.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-4 border border-red-100">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={18} color="#DC2626" />
              <h2 className="font-semibold text-sm text-red-600">Alertas de stock bajo</h2>
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

        {/* Accesos rápidos */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/productos')}
            className="bg-white rounded-xl shadow-sm p-4 text-left hover:opacity-90 transition-opacity border border-purple-100"
          >
            <Package size={28} color="#2D1B4E" className="mb-1" />
            <p className="font-semibold text-sm" style={{ color: '#2D1B4E' }}>Inventario</p>
            <p className="text-xs text-gray-500">Ver productos</p>
          </button>
          <button
            onClick={() => navigate('/movimientos/nuevo')}
            className="bg-white rounded-xl shadow-sm p-4 text-left hover:opacity-90 transition-opacity border border-purple-100"
          >
            <ArrowLeftRight size={28} color="#2D1B4E" className="mb-1" />
            <p className="font-semibold text-sm" style={{ color: '#2D1B4E' }}>Movimiento</p>
            <p className="text-xs text-gray-500">Registrar entrada/salida</p>
          </button>
          <button
            onClick={() => navigate('/reportes')}
            className="bg-white rounded-xl shadow-sm p-4 text-left hover:opacity-90 transition-opacity border border-purple-100 col-span-2"
          >
            <BarChart2 size={28} color="#2D1B4E" className="mb-1" />
            <p className="font-semibold text-sm" style={{ color: '#2D1B4E' }}>Reportes</p>
            <p className="text-xs text-gray-500">Ver historial de movimientos</p>
          </button>
        </div>

      </div>
    </div>
  )
}
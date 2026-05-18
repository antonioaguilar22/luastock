import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

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
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Cargando...</p>
    </div>
  )

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-800">LuaStock</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-gray-800"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-4">

        {/* Saludo */}
        <p className="text-gray-600 text-sm">¡Hola, {user.nombre}! 👋</p>

        {/* Métricas */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <p className="text-2xl font-bold text-gray-800">{data.total_productos}</p>
            <p className="text-xs text-gray-500 mt-1">Productos</p>
          </div>
          <div className={`rounded-xl shadow-sm p-3 text-center ${data.total_stock_bajo > 0 ? 'bg-red-50' : 'bg-white'}`}>
            <p className={`text-2xl font-bold ${data.total_stock_bajo > 0 ? 'text-red-500' : 'text-gray-800'}`}>
              {data.total_stock_bajo}
            </p>
            <p className="text-xs text-gray-500 mt-1">Stock bajo</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-3 text-center">
            <p className="text-2xl font-bold text-gray-800">{data.movimientos_hoy}</p>
            <p className="text-xs text-gray-500 mt-1">Movimientos hoy</p>
          </div>
        </div>

        {/* Alertas de stock bajo */}
        {data.productos_stock_bajo.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-red-500">⚠️</span>
              <h2 className="font-semibold text-gray-800 text-sm">Alertas de stock bajo</h2>
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
            className="bg-white rounded-xl shadow-sm p-4 text-left hover:bg-gray-50 transition-colors"
          >
            <p className="text-2xl mb-1">📦</p>
            <p className="font-semibold text-gray-800 text-sm">Inventario</p>
            <p className="text-xs text-gray-500">Ver productos</p>
          </button>
          <button
            onClick={() => navigate('/movimientos/nuevo')}
            className="bg-white rounded-xl shadow-sm p-4 text-left hover:bg-gray-50 transition-colors"
          >
            <p className="text-2xl mb-1">📝</p>
            <p className="font-semibold text-gray-800 text-sm">Movimiento</p>
            <p className="text-xs text-gray-500">Registrar entrada/salida</p>
          </button>
        </div>

      </div>
    </div>
  )
}
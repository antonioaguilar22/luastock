import { useState, useEffect } from 'react'
import { getProductos, deleteProducto } from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function Productos() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    cargarProductos()
  }, [])

  const cargarProductos = async () => {
    try {
      const data = await getProductos()
      setProductos(data)
    } catch (err) {
      console.error('Error al cargar productos:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return
    try {
      await deleteProducto(id)
      setProductos(productos.filter(p => p.id !== id))
    } catch (err) {
      console.error('Error al eliminar producto:', err)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Cargando productos...</p>
    </div>
  )

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: '#F5F0FF' }}>
      <div className="max-w-lg mx-auto px-4 pt-4 pb-2">
        <p className="text-sm font-semibold" style={{ color: '#2D1B4E' }}>Catálogo de productos</p>
      </div>
      <div className="max-w-lg mx-auto">
        <div className="px-4 py-4 flex items-center justify-between" style={{ backgroundColor: '#2D1B4E' }}>
          <button onClick={() => navigate('/dashboard')} className="text-left hover:opacity-80 transition-opacity">
            <h1 className="text-xl font-bold text-white tracking-wide">LuaStock</h1>
            <p className="text-xs" style={{ color: '#C4B5E8' }}>Lua Skin Care</p>
          </button>
          <button
            onClick={() => navigate('/productos/nuevo')}
            className="text-sm px-4 py-2 rounded-lg font-medium hover:opacity-80 transition-opacity"
            style={{ backgroundColor: '#C4B5E8', color: '#2D1B4E' }}
          >
            + Agregar
          </button>
        </div>

        {productos.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">No hay productos registrados</p>
        ) : (
          <div className="space-y-3">
            {productos.map(producto => (
              <div key={producto.id} className="bg-white rounded-xl shadow-sm p-4 border border-purple-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1 mr-3">
                    <h2 className="font-semibold text-sm" style={{ color: '#2D1B4E' }}>{producto.nombre}</h2>
                    {producto.descripcion && (
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{producto.descripcion}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className={`text-xl font-bold ${producto.stock <= producto.stock_minimo ? 'text-red-500' : ''
                      }`} style={producto.stock > producto.stock_minimo ? { color: '#2D1B4E' } : {}}>
                      {producto.stock}
                    </span>
                    <p className="text-xs text-gray-400">uds.</p>
                    {producto.stock <= producto.stock_minimo && (
                      <p className="text-xs text-red-400 font-medium">Stock bajo</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/productos/editar/${producto.id}`)}
                    className="flex-1 text-sm text-white rounded-lg py-2 hover:opacity-90 transition-opacity font-medium"
                    style={{ backgroundColor: '#2D1B4E' }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(producto.id)}
                    className="flex-1 text-sm bg-red-500 text-white rounded-lg py-2 hover:bg-red-600 transition-colors font-medium"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
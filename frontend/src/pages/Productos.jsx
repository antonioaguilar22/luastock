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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-800">Productos</h1>
          <button
            onClick={() => navigate('/productos/nuevo')}
            className="bg-gray-800 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            + Agregar
          </button>
        </div>

        {productos.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">No hay productos registrados</p>
        ) : (
          <div className="space-y-3">
            {productos.map(producto => (
              <div key={producto.id} className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-medium text-gray-800">{producto.nombre}</h2>
                    <p className="text-sm text-gray-500">{producto.descripcion}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-bold ${producto.stock <= producto.stock_minimo ? 'text-red-500' : 'text-gray-800'}`}>
                      {producto.stock}
                    </span>
                    <p className="text-xs text-gray-400">unidades</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => navigate(`/productos/editar/${producto.id}`)}
                    className="flex-1 text-sm border border-gray-300 rounded-lg py-1 hover:bg-gray-50 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(producto.id)}
                    className="flex-1 text-sm border border-red-200 text-red-500 rounded-lg py-1 hover:bg-red-50 transition-colors"
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
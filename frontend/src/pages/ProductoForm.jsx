import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createProducto, updateProducto, getProductos } from '../services/api'

export default function ProductoForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    stock: '',
    stock_minimo: '5'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEditing) {
      cargarProducto()
    }
  }, [id])

  const cargarProducto = async () => {
    try {
      const productos = await getProductos()
      const producto = productos.find(p => p.id === parseInt(id))
      if (producto) {
        setForm({
          nombre: producto.nombre,
          descripcion: producto.descripcion || '',
          stock: producto.stock.toString(),
          stock_minimo: producto.stock_minimo.toString()
        })
      }
    } catch (err) {
      console.error('Error al cargar producto:', err)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!form.nombre || !form.stock) {
      setError('El nombre y el stock son obligatorios')
      return
    }

    setLoading(true)
    setError('')

    try {
      const payload = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        stock: parseInt(form.stock),
        stock_minimo: parseInt(form.stock_minimo)
      }

      if (isEditing) {
        await updateProducto(id, payload)
      } else {
        await createProducto(payload)
      }

      navigate('/productos')
    } catch (err) {
      setError('Error al guardar el producto, intenta de nuevo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/productos')}
            className="text-gray-500 hover:text-gray-800"
          >
            ←
          </button>
          <h1 className="text-xl font-bold text-gray-800">
            {isEditing ? 'Editar producto' : 'Nuevo producto'}
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del producto *
            </label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="Ej. Crema hidratante"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="Descripción opcional del producto"
              rows={3}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock actual *
              </label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="0"
                min="0"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock mínimo
              </label>
              <input
                type="number"
                name="stock_minimo"
                value={form.stock_minimo}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="5"
                min="0"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gray-800 text-white rounded-lg py-2 text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear producto'}
          </button>
        </div>
      </div>
    </div>
  )
}
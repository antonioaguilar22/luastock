import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function MovimientoForm() {
    const navigate = useNavigate()
    const [productos, setProductos] = useState([])
    const [form, setForm] = useState({
        producto_id: '',
        tipo: 'entrada',
        cantidad: '',
        nota: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        cargarProductos()
    }, [])

    const cargarProductos = async () => {
        try {
            const response = await api.get('/productos')
            setProductos(response.data)
        } catch (err) {
            console.error('Error al cargar productos:', err)
        }
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async () => {
        if (!form.producto_id || !form.cantidad) {
            setError('Selecciona un producto e ingresa la cantidad')
            return
        }

        setLoading(true)
        setError('')

        try {
            await api.post('/movimientos', {
                producto_id: parseInt(form.producto_id),
                tipo: form.tipo,
                cantidad: parseInt(form.cantidad),
                nota: form.nota
            })
            navigate('/dashboard', { state: { mensaje: 'Movimiento registrado correctamente' } })
        } catch (err) {
            setError(err.response?.data?.message || 'Error al registrar movimiento')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen p-4" style={{ backgroundColor: '#F5F0FF' }}>
            <div className="max-w-lg mx-auto">

                <div className="px-4 py-4 flex items-center justify-between mb-6" style={{ backgroundColor: '#2D1B4E' }}>
                    <button onClick={() => navigate('/dashboard')} className="text-left hover:opacity-80 transition-opacity">
                        <h1 className="text-xl font-bold text-white tracking-wide">LuaStock</h1>
                        <p className="text-xs" style={{ color: '#C4B5E8' }}>Lua Skin Care</p>
                    </button>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-3xl font-bold hover:opacity-80 transition-opacity leading-none"
                        style={{ color: '#C4B5E8' }}
                    >
                        ←
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">

                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3">
                            {error}
                        </div>
                    )}

                    {/* Selector de producto */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Producto
                        </label>
                        <select
                            name="producto_id"
                            value={form.producto_id}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                        >
                            <option value="">Selecciona un producto...</option>
                            {productos.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.nombre} — {p.stock} uds. disponibles
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Tipo de movimiento */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tipo de movimiento
                        </label>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setForm({ ...form, tipo: 'entrada' })}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${form.tipo === 'entrada'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                ↑ Entrada
                            </button>
                            <button
                                onClick={() => setForm({ ...form, tipo: 'salida' })}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${form.tipo === 'salida'
                                        ? 'bg-red-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                ↓ Salida
                            </button>
                        </div>
                    </div>

                    {/* Cantidad */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cantidad
                        </label>
                        <input
                            type="number"
                            name="cantidad"
                            value={form.cantidad}
                            onChange={handleChange}
                            min="1"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                            placeholder="0"
                        />
                    </div>

                    {/* Nota */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nota (opcional)
                        </label>
                        <textarea
                            name="nota"
                            value={form.nota}
                            onChange={handleChange}
                            rows={3}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                            placeholder="Ej. Venta a cliente, reabastecimiento..."
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-gray-800 text-white rounded-lg py-2 text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Registrando...' : 'Registrar movimiento'}
                    </button>

                </div>
            </div>
        </div>
    )
}
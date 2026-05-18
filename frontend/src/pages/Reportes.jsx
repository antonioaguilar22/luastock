import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Reportes() {
    const navigate = useNavigate()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [desde, setDesde] = useState('')
    const [hasta, setHasta] = useState('')

    useEffect(() => {
        cargarReporte()
    }, [])

    const cargarReporte = async () => {
        setLoading(true)
        try {
            const params = desde && hasta ? `?desde=${desde}&hasta=${hasta}` : ''
            const response = await api.get(`/reportes${params}`)
            setData(response.data)
        } catch (err) {
            console.error('Error al cargar reporte:', err)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-500">Cargando reporte...</p>
        </div>
    )

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

                {/* Filtro por fechas */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">Filtrar por período</p>
                    <div className="flex gap-3 items-end">
                        <div className="flex-1">
                            <label className="block text-xs text-gray-500 mb-1">Desde</label>
                            <input
                                type="date"
                                value={desde}
                                onChange={(e) => setDesde(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs text-gray-500 mb-1">Hasta</label>
                            <input
                                type="date"
                                value={hasta}
                                onChange={(e) => setHasta(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                            />
                        </div>
                        <button
                            onClick={cargarReporte}
                            className="bg-gray-800 text-white rounded-lg px-4 py-2 text-sm hover:bg-gray-700 transition-colors"
                        >
                            Filtrar
                        </button>
                    </div>
                </div>

                {/* Resumen por producto */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
                    <h2 className="font-semibold text-gray-800 text-sm mb-3">Resumen por producto</h2>
                    <div className="space-y-3">
                        {data.resumen.map((item, i) => (
                            <div key={i} className="border border-gray-100 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="font-medium text-gray-800 text-sm">{item.nombre}</p>
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${item.stock_actual <= item.stock_minimo
                                            ? 'bg-red-100 text-red-600'
                                            : 'bg-green-100 text-green-600'
                                        }`}>
                                        {item.stock_actual} uds.
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div>
                                        <p className="text-green-600 font-bold text-sm">+{item.total_entradas}</p>
                                        <p className="text-xs text-gray-400">Entradas</p>
                                    </div>
                                    <div>
                                        <p className="text-red-500 font-bold text-sm">-{item.total_salidas}</p>
                                        <p className="text-xs text-gray-400">Salidas</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-800 font-bold text-sm">{item.total_movimientos}</p>
                                        <p className="text-xs text-gray-400">Movimientos</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Historial de movimientos */}
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <h2 className="font-semibold text-gray-800 text-sm mb-3">
                        Historial ({data.total_movimientos} movimientos)
                    </h2>
                    {data.movimientos.length === 0 ? (
                        <p className="text-center text-gray-400 text-sm py-4">No hay movimientos en este período</p>
                    ) : (
                        <div className="space-y-2">
                            {data.movimientos.map(m => (
                                <div key={m.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{m.producto_nombre}</p>
                                        <p className="text-xs text-gray-400">
                                            {new Date(m.created_at).toLocaleDateString('es-MX', {
                                                day: '2-digit', month: 'short', year: 'numeric'
                                            })}
                                            {m.nota && ` · ${m.nota}`}
                                        </p>
                                    </div>
                                    <span className={`text-sm font-bold ${m.tipo === 'entrada' ? 'text-green-500' : 'text-red-500'
                                        }`}>
                                        {m.tipo === 'entrada' ? '+' : '-'}{m.cantidad}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}
import { useState } from 'react'
import { loginUser } from '../services/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await loginUser(email, password)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      window.location.href = '/dashboard'
    } catch (err) {
      setError('Credenciales incorrectas, intenta de nuevo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#2D1B4E' }}>

      {/* Header de marca */}
      <div className="flex flex-col items-center justify-center pt-16 pb-8">
        <h1 className="text-4xl font-bold text-white tracking-wide">LuaStock</h1>
        <p className="text-sm mt-1" style={{ color: '#C4B5E8' }}>Lua Skin Care</p>
      </div>

      {/* Tarjeta de login */}
      <div className="flex-1 flex items-start justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8">
          <h2 className="text-lg font-bold text-center mb-1" style={{ color: '#2D1B4E' }}>
            Bienvenida
          </h2>
          <p className="text-center text-gray-500 text-sm mb-6">
            Inicia sesión para continuar
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#2D1B4E' }}>
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': '#2D1B4E' }}
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#2D1B4E' }}>
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2"
                placeholder="••••••••"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full text-white rounded-lg py-2 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#2D1B4E' }}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}
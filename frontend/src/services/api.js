import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000'
})

export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', { email, password })
  return response.data
}

export const registerUser = async (nombre, email, password) => {
  const response = await api.post('/auth/register', { nombre, email, password })
  return response.data
}

export const getProductos = async () => {
  const response = await api.get('/productos')
  return response.data
}

export const createProducto = async (producto) => {
  const response = await api.post('/productos', producto)
  return response.data
}

export const updateProducto = async (id, producto) => {
  const response = await api.put(`/productos/${id}`, producto)
  return response.data
}

export const deleteProducto = async (id) => {
  const response = await api.delete(`/productos/${id}`)
  return response.data
}
export default api
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

export default api
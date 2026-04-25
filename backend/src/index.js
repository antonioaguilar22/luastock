import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import pool from './db.js'
import authRoutes from './routes/auth.js'
import productosRoutes from './routes/productos.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// Rutas
app.use('/auth', authRoutes)
app.use('/productos', productosRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'LuaStock API funcionando' })
})

// Probar conexión
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error conectando a PostgreSQL:', err)
  } else {
    console.log('PostgreSQL conectado:', res.rows[0].now)
  }
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})
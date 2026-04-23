import pool from '../db.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
  const { nombre, email, password } = req.body

  try {
    // Verificar si el usuario ya existe
    const userExists = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    )

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'El usuario ya existe' })
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Crear usuario
    const newUser = await pool.query(
      'INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3) RETURNING id, nombre, email',
      [nombre, email, hashedPassword]
    )

    // Generar token
    const token = jwt.sign(
      { id: newUser.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      message: 'Usuario creado correctamente',
      token,
      user: newUser.rows[0]
    })

  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor', error: err.message })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body

  try {
    // Verificar si el usuario existe
    const user = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    )

    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Credenciales incorrectas' })
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.rows[0].password)

    if (!validPassword) {
      return res.status(400).json({ message: 'Credenciales incorrectas' })
    }

    // Generar token
    const token = jwt.sign(
      { id: user.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.rows[0].id,
        nombre: user.rows[0].nombre,
        email: user.rows[0].email
      }
    })

  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor', error: err.message })
  }
}
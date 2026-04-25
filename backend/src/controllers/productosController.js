import pool from '../db.js'

export const getProductos = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM productos ORDER BY created_at DESC'
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener productos', error: err.message })
  }
}

export const getProductoById = async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query(
      'SELECT * FROM productos WHERE id = $1',
      [id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' })
    }
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener producto', error: err.message })
  }
}

export const createProducto = async (req, res) => {
  const { nombre, descripcion, stock, stock_minimo } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO productos (nombre, descripcion, stock, stock_minimo) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, descripcion, stock, stock_minimo]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ message: 'Error al crear producto', error: err.message })
  }
}

export const updateProducto = async (req, res) => {
  const { id } = req.params
  const { nombre, descripcion, stock, stock_minimo } = req.body
  try {
    const result = await pool.query(
      'UPDATE productos SET nombre = $1, descripcion = $2, stock = $3, stock_minimo = $4, updated_at = NOW() WHERE id = $5 RETURNING *',
      [nombre, descripcion, stock, stock_minimo, id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' })
    }
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar producto', error: err.message })
  }
}

export const deleteProducto = async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query(
      'DELETE FROM productos WHERE id = $1 RETURNING *',
      [id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' })
    }
    res.json({ message: 'Producto eliminado correctamente' })
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar producto', error: err.message })
  }
}
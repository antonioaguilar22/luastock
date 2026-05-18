import pool from '../db.js'

export const getMovimientos = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT m.*, p.nombre as producto_nombre
      FROM movimientos m
      JOIN productos p ON m.producto_id = p.id
      ORDER BY m.created_at DESC
      LIMIT 50
    `)
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener movimientos', error: err.message })
  }
}

export const createMovimiento = async (req, res) => {
  const { producto_id, tipo, cantidad, nota } = req.body

  if (!producto_id || !tipo || !cantidad) {
    return res.status(400).json({ message: 'Producto, tipo y cantidad son obligatorios' })
  }

  try {
    // Verificar que el producto existe
    const producto = await pool.query(
      'SELECT * FROM productos WHERE id = $1', [producto_id]
    )

    if (producto.rows.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' })
    }

    // Verificar que hay suficiente stock para una salida
    if (tipo === 'salida' && producto.rows[0].stock < cantidad) {
      return res.status(400).json({ message: 'Stock insuficiente para registrar la salida' })
    }

    // Registrar el movimiento
    const movimiento = await pool.query(
      'INSERT INTO movimientos (producto_id, tipo, cantidad, nota) VALUES ($1, $2, $3, $4) RETURNING *',
      [producto_id, tipo, cantidad, nota]
    )

    // Actualizar el stock del producto
    const nuevoStock = tipo === 'entrada'
      ? producto.rows[0].stock + parseInt(cantidad)
      : producto.rows[0].stock - parseInt(cantidad)

    await pool.query(
      'UPDATE productos SET stock = $1, updated_at = NOW() WHERE id = $2',
      [nuevoStock, producto_id]
    )

    res.status(201).json({
      movimiento: movimiento.rows[0],
      stock_actualizado: nuevoStock
    })

  } catch (err) {
    res.status(500).json({ message: 'Error al registrar movimiento', error: err.message })
  }
}
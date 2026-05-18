import pool from '../db.js'

export const getDashboard = async (req, res) => {
  try {
    const totalProductos = await pool.query(
      'SELECT COUNT(*) FROM productos'
    )

    const stockBajo = await pool.query(
      'SELECT * FROM productos WHERE stock <= stock_minimo ORDER BY stock ASC'
    )

    const movimientosHoy = await pool.query(
      `SELECT COUNT(*) FROM movimientos 
       WHERE DATE(created_at) = CURRENT_DATE`
    )

    res.json({
      total_productos: parseInt(totalProductos.rows[0].count),
      productos_stock_bajo: stockBajo.rows,
      total_stock_bajo: stockBajo.rows.length,
      movimientos_hoy: parseInt(movimientosHoy.rows[0].count),
    })

  } catch (err) {
    res.status(500).json({ message: 'Error al obtener dashboard', error: err.message })
  }
}
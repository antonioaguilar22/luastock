import pool from '../db.js'

export const getReporteMovimientos = async (req, res) => {
  try {
    const { desde, hasta } = req.query

    let query = `
      SELECT 
        m.id,
        m.tipo,
        m.cantidad,
        m.nota,
        m.created_at,
        p.nombre as producto_nombre,
        p.stock as stock_actual
      FROM movimientos m
      JOIN productos p ON m.producto_id = p.id
    `
    const params = []

    if (desde && hasta) {
      query += ` WHERE DATE(m.created_at) BETWEEN $1 AND $2`
      params.push(desde, hasta)
    }

    query += ` ORDER BY m.created_at DESC`

    const movimientos = await pool.query(query, params)

    // Resumen por producto
    const resumen = await pool.query(`
      SELECT 
        p.nombre,
        p.stock as stock_actual,
        p.stock_minimo,
        COALESCE(SUM(CASE WHEN m.tipo = 'entrada' THEN m.cantidad ELSE 0 END), 0) as total_entradas,
        COALESCE(SUM(CASE WHEN m.tipo = 'salida' THEN m.cantidad ELSE 0 END), 0) as total_salidas,
        COUNT(m.id) as total_movimientos
      FROM productos p
      LEFT JOIN movimientos m ON p.id = m.producto_id
      GROUP BY p.id, p.nombre, p.stock, p.stock_minimo
      ORDER BY total_movimientos DESC
    `)

    res.json({
      movimientos: movimientos.rows,
      resumen: resumen.rows,
      total_movimientos: movimientos.rows.length
    })

  } catch (err) {
    res.status(500).json({ message: 'Error al generar reporte', error: err.message })
  }
}
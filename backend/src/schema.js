import pool from './db.js'

const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS productos (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        descripcion TEXT,
        stock INTEGER NOT NULL DEFAULT 0,
        stock_minimo INTEGER NOT NULL DEFAULT 5,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS movimientos (
        id SERIAL PRIMARY KEY,
        producto_id INTEGER REFERENCES productos(id),
        tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('entrada', 'salida')),
        cantidad INTEGER NOT NULL,
        nota TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `)
    console.log('Tablas creadas correctamente')
  } catch (err) {
    console.error('Error creando tablas:', err)
  } finally {
    pool.end()
  }
}

createTables()
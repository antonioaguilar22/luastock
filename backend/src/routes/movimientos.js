import express from 'express'
import { getMovimientos, createMovimiento } from '../controllers/movimientosController.js'

const router = express.Router()

router.get('/', getMovimientos)
router.post('/', createMovimiento)

export default router
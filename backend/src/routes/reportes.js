import express from 'express'
import { getReporteMovimientos } from '../controllers/reportesController.js'

const router = express.Router()

router.get('/', getReporteMovimientos)

export default router
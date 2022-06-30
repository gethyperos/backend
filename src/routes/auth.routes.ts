import login from '@controller/auth.controllers'
import express from 'express'

const router = express.Router()

router.post('/', login)

export default router

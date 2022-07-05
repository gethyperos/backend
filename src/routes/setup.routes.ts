import express from 'express'

import install from '@controller/install.controllers'

const router = express.Router()

router.post('/', install)

export default router

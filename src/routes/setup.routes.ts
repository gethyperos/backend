import express from 'express'

import install, { checkInstall } from '@controller/install.controllers'

const router = express.Router()

router.post('/', install)
router.get('/', checkInstall)

export default router

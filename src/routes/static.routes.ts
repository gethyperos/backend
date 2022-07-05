import express from 'express'

import { getAppStatic } from '@controller/repo.controllers'

const router = express.Router()

router.get('/:app', getAppStatic)

export default router

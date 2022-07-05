import express from 'express'

import { getRepositoryApp, getRepositoryApps } from '@controller/repo.controllers'

const router = express.Router()

router.get('/apps', getRepositoryApps)
router.get('/apps/:appId', getRepositoryApp)

export default router

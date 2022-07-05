import express from 'express'

import { getRepositoryApp, getRepositoryApps } from '@controller/repo.controllers'

const router = express.Router()

router.get('/', getRepositoryApps)
router.get('/:appId', getRepositoryApp)

export default router

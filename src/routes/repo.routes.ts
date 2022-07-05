import express from 'express'

import { getRepositoryApps, getRepositoryCategories } from '@controller/repo.controllers'

const router = express.Router()

router.get('/apps', getRepositoryApps)
router.get('/apps/:appId', getRepositoryApps)
router.get('/categories', getRepositoryCategories)
router.get('/categories/:categoryName', getRepositoryCategories)

export default router

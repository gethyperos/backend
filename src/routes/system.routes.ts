import express from 'express'

import { listConfigs } from '@controller/config.controllers'
import { listRunningContainers, listDownloadedImages } from '@controller/docker.controllers'
import authMiddleware from '@middleware/auth.middleware'

const router = express.Router()

router.get('/docker/containers', authMiddleware, listRunningContainers)
router.get('/docker/images', authMiddleware, listDownloadedImages)
router.get('/configs', authMiddleware, listConfigs)

export default router

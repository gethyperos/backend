import express from 'express'

import { getConfigs, updateConfig } from '@controller/config.controllers'
import { listRunningContainers, listDownloadedImages } from '@controller/docker.controllers'
import authMiddleware from '@middleware/auth.middleware'

const router = express.Router()

router.get('/configs', authMiddleware, getConfigs)
router.get('/configs/:configKey', authMiddleware, getConfigs)
router.put('/configs', authMiddleware, updateConfig)
router.get('/docker/containers', authMiddleware, listRunningContainers)
router.get('/docker/images', authMiddleware, listDownloadedImages)

export default router

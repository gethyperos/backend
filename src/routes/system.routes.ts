import express from 'express'

import { getConfigs, updateConfig } from '@controller/config.controllers'
import { getContainers, getImages } from '@controller/docker.controllers'
import authMiddleware from '@middleware/auth.middleware'

const router = express.Router()

router.get('/configs', authMiddleware, getConfigs)
router.get('/configs/:configKey', authMiddleware, getConfigs)
router.put('/configs', authMiddleware, updateConfig)
// Do not cache system information routes.
// Ex: Containers, Images, CPU, RAM, Disk, etc.
router.get('/containers', authMiddleware, getContainers)
router.get('/containers/:containerId', authMiddleware, getContainers)
router.get('/images/:image', authMiddleware, getImages)

export default router

import express from 'express'

import {
  getInstalledApp,
  getInstalledApps,
  installApp,
  uninstallApp,
  updateInstalledApp,
  startApp,
  stopApp,
  buildCustomApp,
} from '@controller/apps.controller'
import authMiddleware from '@middleware/auth.middleware'

const router = express.Router()

router.get('/', authMiddleware, getInstalledApps)
router.get('/:appId', authMiddleware, getInstalledApp)
router.put('/:appId', authMiddleware, updateInstalledApp)
router.post('/', authMiddleware, installApp)
router.post('/start/:appId', authMiddleware, startApp)
router.post('/stop/:appId', authMiddleware, stopApp)
router.post('/custom', authMiddleware, buildCustomApp)
router.delete('/:appId', authMiddleware, uninstallApp)

export default router

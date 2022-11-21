import express from 'express'

import {
  getApps,
  getAppState,
  installApp,
  uninstallApp,
  updateApp,
  startApp,
  stopApp,
  installCustomApp,
} from '@controller/apps.controller'
import authMiddleware from '@middleware/auth.middleware'

const router = express.Router()

router.get('/', authMiddleware, getApps)
router.post('/', authMiddleware, installApp)
router.get('/:appId', authMiddleware, getApps)
router.put('/:appId', authMiddleware, updateApp)
router.post('/start/:appId', authMiddleware, startApp)
router.post('/stop/:appId', authMiddleware, stopApp)
router.post('/custom', authMiddleware, installCustomApp)
router.delete('/:appId', authMiddleware, uninstallApp)
router.get('/:appId/state', authMiddleware, getAppState)
router.post('/import', authMiddleware, installCustomApp)

export default router

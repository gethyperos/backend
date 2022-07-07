import express from 'express'

import { getAppStatic, getRepoStatic } from '@controller/repo.controllers'

const router = express.Router()

router.get('/file', getRepoStatic)
router.get('/:app', getAppStatic)

export default router

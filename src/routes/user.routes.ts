import express from 'express'

import {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  removeUser,
  firstUser,
} from '@controller/user.controllers'

import authMiddleware from '@middleware/auth.middleware'

const router = express.Router()

router.get('/:userId', getUser)
router.get('/', getAllUsers)
router.post('/', authMiddleware, createUser)
router.post('/first', authMiddleware, firstUser)
router.put('/:userId', authMiddleware, updateUser)
router.delete('/:userId', authMiddleware, removeUser)

export default router

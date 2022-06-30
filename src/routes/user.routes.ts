import express from 'express'

import {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  removeUser,
} from '@controller/user.controllers'

import authMiddleware from '@middleware/auth.middleware'

const router = express.Router()

router.get('/:userId', getUser)
router.get('/', getAllUsers)
router.post('/', authMiddleware, createUser)
router.put('/:userId', authMiddleware, updateUser)
router.delete('/:userId', authMiddleware, removeUser)

export default router

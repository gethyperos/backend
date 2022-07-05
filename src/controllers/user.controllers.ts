import type { Request, Response, NextFunction } from 'express'
import { searchWithParameters } from '@util/filtering'
import {
  createUserDB,
  getAllUsersDB,
  getUserDB,
  removeUserDB,
  updateUserDB,
} from '@service/user.services'

export async function createUser(req: Request, res: Response, next: NextFunction) {
  const { username, password } = req.body

  if (!username) {
    next({
      statusCode: 400,
      message: 'Missing field',
      error: 'Missing username field.',
    })
  }

  if (!password) {
    next({
      statusCode: 400,
      message: 'Missing field',
      error: 'Missing password field.',
    })
  }

  try {
    const user = await createUserDB({ username, password })

    res.status(200).json({ user })
  } catch (e) {
    next({
      statusCode: 400,
      message: `${e}`,
      error: 'Unable to create user',
    })
  }
}

export async function getAllUsers(req: Request, res: Response, next: NextFunction) {
  const filters = req.query

  const users = await getAllUsersDB()
  const filteredUsers = searchWithParameters(filters, users)
  res.status(200).json({ users: filteredUsers })
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
  const { userId } = req.params

  if (!userId) {
    next({
      statusCode: 400,
      message: 'Missing field',
      error: 'Missing username field.',
    })
    throw new Error('Missing userId')
  }

  try {
    const user = await getUserDB(Number(userId))

    res.status(200).json({ user })
  } catch (e) {
    next({
      statusCode: 400,
      message: `${e}`,
      error: 'User not found',
    })
  }
}

export async function updateUser(req: Request, res: Response, next: NextFunction) {
  const data = req.body

  try {
    const user = await updateUserDB(Number.parseInt(req.params.userId, 2), data)

    res.status(200).json({ users: [user] })
  } catch (e) {
    next({
      statusCode: 400,
      message: `${e}`,
      error: 'Unable to update user.',
    })
  }
}

export async function removeUser(req: Request, res: Response, next: NextFunction) {
  const { userId } = req.params

  if (!userId) {
    next({
      statusCode: 400,
      message: 'Missing field',
      error: 'Missing userId field.',
    })
  }

  try {
    const user = await removeUserDB(Number(userId))

    res.status(200).json({ users: [user] })
  } catch (e) {
    next({
      statusCode: 400,
      message: `${e}`,
      error: 'User not found',
    })
  }
}

export async function firstUser(req: Request, res: Response, next: NextFunction) {
  const { username, password } = req.body

  if (!username) {
    next({
      statusCode: 400,
      message: 'Missing field',
      error: 'Missing username field.',
    })
  }

  if (!password) {
    next({
      statusCode: 400,
      message: 'Missing field',
      error: 'Missing password field.',
    })
  }

  try {
    const userList = await getAllUsersDB()

    if (userList.length > 0) {
      throw new Error('Another user alredy exists')
    }

    const user = await createUserDB({ username, password })

    res.status(200).json({ user })
  } catch (e) {
    next({
      statusCode: 401,
      message: `${e}`,
      error: 'Internal Error',
    })
  }
}

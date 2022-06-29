import type { Request, Response, NextFunction } from 'express'
import searchWithParameters from '@util/filtering'
import {
  createUserDB,
  getAllUsersDB,
  getUserDB,
  removeUserDB,
  updateUserDB,
} from '@service/user.service'

export async function createUser(req: Request, res: Response, next: NextFunction) {
  const { name, password } = req.body

  try {
    const user = createUserDB({ name, password })

    res.status(200).json(user)
  } catch (e) {
    next({
      status: 400,
    })
  }
}

export async function getAllUsers(req: Request, res: Response) {
  const filters = req.query

  const users = await getAllUsersDB()
  const filteredUsers = searchWithParameters(filters, users)

  res.status(200).json({ users: filteredUsers })
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
  const { userId } = req.params

  const user = await getUserDB(Number.parseInt(userId, 2))

  if (!user) {
    next({
      status: 400,
    })
  }

  res.status(200).json({ user })
}

export async function updateUser(req: Request, res: Response, next: NextFunction) {
  const data = req.body

  try {
    const user = await updateUserDB(Number.parseInt(req.params.userId, 2), data)

    res.status(200).json({ user })
  } catch (e) {
    next({
      status: 400,
      error: String(e),
    })
  }
}

export async function removeUser(req: Request, res: Response, next: NextFunction) {
  const { userId } = req.params

  try {
    const user = removeUserDB(Number.parseInt(userId, 2))

    res.status(200).json({ user })
  } catch (e) {
    next({
      status: 400,
      error: String(e),
    })
  }
}

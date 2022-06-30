import { getUserByToken } from '@util/webtoken'
import { NextFunction, Request, Response } from 'express'

export default async function authenticate(req: Request, res: Response, next: NextFunction) {
  const bearer = req.headers.authorization

  if (!bearer) {
    next({
      status: 401,
      error: 'Unauthorized',
      message: 'A token is required',
    })
  }

  const token = bearer?.split(' ')[1]

  if (!token) {
    next({
      status: 401,
      error: 'Unauthorized',
      message: 'A token is required',
    })
  }

  try {
    const user = await getUserByToken(token as string)
    req.user = user
    next()
  } catch (err) {
    next({
      status: 401,
      error: 'Unauthorized',
      message: err,
    })
  }
}

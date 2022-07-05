import { getUserByToken } from '@util/webtoken'
import { NextFunction, Request, Response } from 'express'

export default async function authenticate(req: Request, res: Response, next: NextFunction) {
  const bearer = req.headers.authorization

  if (!bearer) {
    next({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Token is required',
    })
  }

  const token = bearer?.split(' ')[1]

  if (!token) {
    next({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Empty token',
    })
  }

  try {
    const user = await getUserByToken(token as string)
    req.user = user
    next()
  } catch (err) {
    next({
      statusCode: 401,
      error: 'Unauthorized',
      message: `${err}`,
    })
  }
}

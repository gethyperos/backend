import { validateToken } from '@util/webtoken'
import { NextFunction, Request, Response } from 'express'
import authenticateUser from '@service/auth.services'

export default async function login(req: Request, res: Response, next: NextFunction) {
  const { username, password } = req.body

  if (!username) {
    next({
      error: 'Missing fields.',
      message: 'Missing username.',
      status: 400,
    })
  }

  if (!password) {
    next({
      error: 'Missing fields.',
      message: 'Missing password.',
      status: 400,
    })
  }

  try {
    const user = await authenticateUser({ username, password })
    const token = await validateToken(user)

    res.json({
      user: {
        name: user.username,
        id: user.id,
        token,
      },
    })
  } catch (e) {
    next({
      statusCode: 401,
      error: `${e}`,
      message: 'Failed authentication/',
    })
  }
}

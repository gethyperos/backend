import { validateToken } from '@util/webtoken'
import { NextFunction, Request, Response } from 'express'
import checkUser from '@service/auth.services'

export default async function login(req: Request, res: Response, next: NextFunction) {
  const { username, password } = req.body

  if (!username || !password) {
    next({
      error: 'Invalid credentials',
      message: 'Please provide a valid username and password',
      status: 400,
    })
  }

  try {
    const user = await checkUser({ username, password })

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
      error: String(e),
      message: 'Invalid credentials',
    })
  }
}

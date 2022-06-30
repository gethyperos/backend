import { validateToken } from '@util/webtoken'
import { NextFunction, Request, Response } from 'express'
import checkUser from '@service/auth.services'

export default async function login(req: Request, res: Response, next: NextFunction) {
  const { name, password } = req.body

  if (!name || !password) {
    next({
      error: 'Invalid credentials',
      message: 'Please provide a valid name and password',
      status: 400,
    })
  }

  try {
    const user = await checkUser({ name, password })

    const token = await validateToken(user)

    res.json({
      user: {
        name: user.name,
        id: user.id,
        token,
      },
    })
  } catch (e) {
    next({
      status: 401,
      error: String(e),
      message: 'Invalid credentials',
    })
  }
}

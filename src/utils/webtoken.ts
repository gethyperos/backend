import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()
const tokenSecret = process.env.JWT_SECRET

export async function validateToken(user: { username: string; id: number }) {
  const token = jwt.sign(
    {
      id: user.id,
      name: user.username,
    },
    tokenSecret as string,
    { expiresIn: '3d' }
  )

  return token
}

export async function getUserByToken(token: string) {
  const decoded = jwt.verify(token, tokenSecret as string) as HyperAPI.IUserPayload
  return decoded
}

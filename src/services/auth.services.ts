import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export default async function checkUser({
  username,
  password,
}: {
  username: string
  password: string
}) {
  const user = await prisma.user.findFirst({
    where: {
      username,
    },
  })

  if (!user) {
    throw new Error('User not found')
  }

  const isValid = await bcrypt.compare(password, user.password)

  if (!isValid) {
    throw new Error('Wrong password')
  }

  return user
}

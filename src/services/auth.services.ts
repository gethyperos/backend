import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export default async function checkUser({ name, password }: { name: string; password: string }) {
  const user = await prisma.user.findFirst({
    where: {
      name,
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

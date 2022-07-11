import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient({
  errorFormat: 'minimal',
})

export async function getUserDB(userId: number) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  })

  if (!user) {
    throw new Error('User not found')
  }

  return user
}

export async function getFilteredUsersDB(filters: any) {
  try {
    const users = await prisma.user.findMany({
      where: {
        ...filters,
      },
    })

    return users
  } catch (e) {
    throw new Error('Unable to fetch datbase')
  }
}

export async function getAllUsersDB() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        createdAt: true,
        updatedAt: true,
        avatar: true,
      },
    })

    return users
  } catch (e) {
    throw new Error('Unable to find user')
  }
}

export async function createUserDB(data: { username: string; password: string; avatar: string }) {
  const hashedPassword = bcrypt.hashSync(data.password, 10)

  try {
    const user = await prisma.user.create({
      data: {
        username: data.username,
        password: hashedPassword,
        avatar: data.avatar,
      },
    })
    return user
  } catch (e) {
    throw new Error('User already exists')
  }
}

export async function updateUserDB(userId: number, data: { name?: string; password?: string }) {
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data,
  })

  return user
}

export async function removeUserDB(userId: number) {
  const user = await getUserDB(userId)

  if (!user) {
    throw new Error('User not found')
  }

  await prisma.user.delete({
    where: {
      id: user.id,
    },
  })

  return user
}

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import searchWithParameters from '@util/filtering'

const prisma = new PrismaClient()

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
  const users = await prisma.user.findMany({
    where: {
      ...filters,
    },
  })

  return users
}

export async function getAllUsersDB() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  })
  const filteredUsers = searchWithParameters({}, users)

  return filteredUsers
}

export async function createUserDB(data: { name: string; password: string }) {
  const hashedPassword = bcrypt.hashSync(data.password, 10)

  const user = await prisma.user.create({
    data: {
      name: data.name,
      password: hashedPassword,
    },
  })

  return user
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

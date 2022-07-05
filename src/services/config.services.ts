import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getConfigsDB() {
  try {
    const configs = await prisma.config.findMany({})

    return configs
  } catch (e) {
    throw new Error('Unable to fetch database')
  }
}

export async function removeConfigDB() {
  // TODO
}

export async function updateConfigDB() {
  // TODO
}

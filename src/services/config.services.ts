import { PrismaClient } from '@prisma/client'
import { clearCache } from '@root/cache/apiCache'

const prisma = new PrismaClient()

export async function getConfigsDB() {
  try {
    const configs = await prisma.config.findMany({})

    return configs
  } catch (e) {
    throw new Error('Unable to fetch database')
  }
}

export async function updateConfigDB(key: string, value: string) {
  clearCache('dockerConn')

  try {
    const config = await prisma.config.update({
      where: {
        key,
      },
      data: {
        value,
      },
    })

    return config
  } catch (e) {
    throw new Error('Unable to update database')
  }
}

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function getFilteredConfigsDB(filters: any) {
  try {
    const configs = await prisma.config.findMany({
      where: {
        ...filters,
      },
    })

    return configs
  } catch (e) {
    throw new Error('Unable to fetch database')
  }
}

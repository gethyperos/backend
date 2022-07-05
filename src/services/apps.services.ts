import { PrismaClient } from '@prisma/client'
import { clearCache } from '@root/cache/apiCache'
import { addDockerContainer, makeContainerData, removeDockerContainer } from '@util/docker'
import { asyncForEach } from '@util/general'
import e from 'express'

const prisma = new PrismaClient()

export async function getAppsDB() {
  const apps = await prisma.app.findMany()

  return apps
}

export async function addApp(app: HyperOS.IAppRepository) {
  const { App: manifest } = app
  const services = makeContainerData(app)
  const containers: string[] = []
  await asyncForEach(services, async (service) => {
    const container = await addDockerContainer(service)
    containers.push(container.id)
  })

  await prisma.app.create({
    data: {
      container: containers.join(','),
      name: manifest.name,
      external: false,
      icon: manifest.icon,
      port: manifest.webuiPort || -1,
    },
  })
}

export async function removeApp(appId: number) {
  const app = await prisma.app.findUnique({ where: { id: appId } })

  if (!app) {
    throw new Error('App not found')
  }
  await asyncForEach(app.container.split(','), async (containerId) => {
    await removeDockerContainer(containerId)
  })

  await prisma.app.delete({ where: { id: appId } })
}

export async function updateAppDB(
  appId: number,
  fieldsToUpdate: { name?: string; icon?: string; port?: number }
) {
  const app = await prisma.app.findUnique({ where: { id: appId } })

  if (!app) {
    throw new Error('App not found')
  }

  const updatedApp = await prisma.app.update({
    where: { id: appId },
    data: fieldsToUpdate,
  })
  clearCache('installedApps')
  return updatedApp
}

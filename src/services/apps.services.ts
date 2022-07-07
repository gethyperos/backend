import { PrismaClient } from '@prisma/client'
import { clearCache } from '@root/cache/apiCache'
import {
  addDockerContainer,
  addDockerNetwork,
  makeContainerData,
  removeDockerContainer,
  removeDockerNetwork,
} from '@util/docker'
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

  const network = await addDockerNetwork(app.Services[Object.keys(app.Services)[0]].container_name)

  try {
    await asyncForEach(services, async (service) => {
      const container = await addDockerContainer(service, network.id)
      containers.push(container.id)
    })
  } catch (err) {
    await asyncForEach(services, async (service) => {
      await removeDockerContainer(service.name)
    })
    await removeDockerNetwork(app.Services[Object.keys(app.Services)[0]].container_name)
    throw err
  }

  const appDB = await prisma.app.create({
    data: {
      container: containers.join(','),
      network: network.id,
      name: manifest.name,
      external: false,
      icon: `Apps/${manifest.directory}/${manifest.icon}`,
      port: Number(manifest.webport) || -1,
    },
  })

  return appDB
}

export async function removeApp(appId: number) {
  const app = await prisma.app.findUnique({ where: { id: appId } })

  if (!app) {
    throw new Error('App not found')
  }

  await asyncForEach(app.container.split(','), async (containerId) => {
    await removeDockerContainer(containerId)
  })

  if (app.network) {
    await removeDockerNetwork(app.network)
  }

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

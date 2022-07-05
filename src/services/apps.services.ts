import { PrismaClient } from '@prisma/client'
import { addDockerContainer, makeContainerData, removeDockerContainer } from '@util/docker'
import { asyncForEach } from '@util/general'

const prisma = new PrismaClient()

export async function getAppsDB() {
  const apps = await prisma.app.findMany()

  return apps
}

export async function installRepositoryApp(app: HyperOS.IAppRepository) {
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

export async function uninstallRepositoryApp(appId: number) {
  const app = await prisma.app.findUnique({ where: { id: appId } })

  if (!app) {
    throw new Error('App not found')
  }
  await asyncForEach(app.container.split(','), async (containerId) => {
    await removeDockerContainer(containerId)
  })

  await prisma.app.delete({ where: { id: appId } })
}

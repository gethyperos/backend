import { PrismaClient } from '@prisma/client'
import { asyncForEach } from '@util/general'
import { fetchRepositoryData, fetchRepositoryFile } from '@service/repo.services'
import { createUserDB } from '@service/user.services'
import { listContainers } from '@service/docker.services'
import { getCompatibleImage } from '@util/docker'
import { addExternalAppDB } from '@service/apps.services'

import axios from 'axios'

import { clearCache } from '@root/cache/apiCache'
import defaultSettings from '../../settings.json'
import { createUserDB } from './user.services'

const prisma = new PrismaClient()

export async function startInitialSetup(
  user: { username: string; password: string },
  hostname: string
) {
  try {
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const key in defaultSettings) {
      // @ts-ignore
      const setting = defaultSettings[key]

      // eslint-disable-next-line no-await-in-loop
      await prisma.config.create({
        data: {
          key,
          value: setting.value,
          type: setting.type,
          description: setting.description,
        },
      })
    }

    // Hostname will be useful in the near future.
    await prisma.config.create({
      data: {
        key: 'hostname',
        value: hostname,
        type: 'string',
      },
    })

    await prisma.config.upsert({
      where: {
        key: '_install_status',
      },
      create: {
        key: '_install_status',
        value: 'true',
        type: 'boolean',
      },
      update: {
        key: '_install_status',
        value: 'true',
        type: 'boolean',
      },
    })

    const avatar = new URL(
      `https://ui-avatars.com/api/?background=random&name=${user.username}&size=200&bold=true`
    ).toString()

    await createUserDB({
      username: user.username,
      password: user.password,
      avatar,
    })
  } catch (e) {
    throw new Error(`${e}`)
  }
}

export async function checkInstallStatus() {
  const installStatus = await prisma.config.findUnique({
    where: {
      key: '_install_status',
    },
  })

  if (!installStatus) {
    return false
  }

  return installStatus.value === 'true'
}

export async function uninstallHyperOS() {
  // TODO
}

export async function importContainers() {
  const containers = await listContainers()
  const repositoryIndex = await fetchRepositoryData()
  const imageTuple: [string, HyperOS.IAppRepository][] = []
  let importCount = 0

  await asyncForEach(repositoryIndex, async (appIndex) => {
    const appManifestURL = await fetchRepositoryFile(appIndex.id, 'app.json')
    const { data: appManifest } = (await axios.get(appManifestURL)) as {
      data: HyperOS.IAppRepository
    }

    // Loop through services and find marching images
    // Services without exposed ports are ignored
    // Service which image is not compatible are also ignored
    Object.keys(appManifest.Services).forEach((serviceId) => {
      const serviceManifest = appManifest.Services[serviceId]
      if (!serviceManifest.ports || serviceManifest.ports.length < 1) {
        return
      }

      const image = getCompatibleImage(serviceManifest.images)
      if (!image) {
        return
      }

      imageTuple.push([image, appManifest])
    })
  })

  await asyncForEach(containers, async (container) => {
    const { Id, Image } = container

    const matchingTuple = imageTuple.find((tuple) => {
      return tuple[0] === Image
    })

    if (!matchingTuple) {
      return
    }

    const matchedImage = matchingTuple[0]
    const appManifest = matchingTuple[1]

    await addExternalAppDB({
      name: appManifest.App.name,
      container: Id,
      directory: appManifest.App.directory,
      icon: appManifest.App.icon,
    })

    importCount += 1
  })

  return importCount
}

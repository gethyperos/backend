import { PrismaClient } from '@prisma/client'
import { resolve } from 'path'
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

    await createUserDB({
      username: user.username,
      password: user.password,
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

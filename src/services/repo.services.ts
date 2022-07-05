import { PrismaClient } from '@prisma/client'
import { ensureCache } from '@root/cache/apiCache'
import { searchWithParameters } from '@util/filtering'

import { fetchFileFromCDN, fetchRepositoryCDN } from '@util/repository'

const prisma = new PrismaClient()

export async function fetchRepositoryData(): Promise<HyperAPI.IAppRepository> {
  const repository = await ensureCache('repository_apps', async () => {
    return fetchFileFromCDN('/index.json')
  })

  return repository
}

export async function fetchRepositoryFile(appId: string, path: string) {
  try {
    const repository = await ensureCache('repository_apps', async () => {
      return fetchRepositoryData()
    })

    const app = searchWithParameters({ id: appId }, repository)[0]

    if (!app) {
      throw new Error('App not found')
    }

    if (path.includes(`Apps/${app.directory}`)) {
      // eslint-disable-next-line no-param-reassign
      path = path.replace(`Apps/${app.directory}/`, '')
    }

    const cdnURL = await fetchRepositoryCDN()

    return `${cdnURL}/Apps/${app.directory}/${path}`
  } catch (e) {
    throw new Error(`${e}`)
  }
}

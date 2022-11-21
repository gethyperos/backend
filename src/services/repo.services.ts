import { PrismaClient } from '@prisma/client'
import { ensureCache } from '@root/cache/apiCache'
import { searchWithParameters } from '@util/filtering'

import { fetchFileFromCDN, fetchRepositoryCDN } from '@util/repository'

const prisma = new PrismaClient()

export async function fetchRepositoryData(): Promise<HyperAPI.IAppRepository[]> {
  const repository = await ensureCache('repository_apps', async () => {
    return fetchFileFromCDN('/index.json')
  })

  return repository
}

export async function fetchRepositoryFile(appId: string | null, path: string) {
  try {
    const repository = await ensureCache('repository_apps', async () => {
      return fetchRepositoryData()
    })

    const cdnURL = await fetchRepositoryCDN()

    if (!appId) {
      return `${cdnURL}/${path}`
    }

    const app = searchWithParameters<HyperAPI.IAppRepository>({ id: appId }, repository)[0]

    if (path.includes(`Apps/${app.directory}`)) {
      // eslint-disable-next-line no-param-reassign
      path = path.replace(`Apps/${app.directory}/`, '')
    }

    return `${cdnURL}/Apps/${app.directory}/${path}`
  } catch (e) {
    throw new Error(`${e}`)
  }
}

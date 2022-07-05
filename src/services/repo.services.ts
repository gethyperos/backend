import { PrismaClient } from '@prisma/client'
import { ensureCache } from '@root/cache/apiCache'
import { searchWithParameters } from '@util/filtering'

import { getFileFromCDN, getRepositoryCDN } from '@util/repository'

const prisma = new PrismaClient()

export async function fetchRepositoryCDN() {
  const repositorySetting = await prisma.config.findUnique({
    where: {
      key: 'repositoryURL',
    },
  })

  if (!repositorySetting) {
    throw new Error('No repository configured')
  }

  const repositoryCDN = getRepositoryCDN(repositorySetting.value)

  return repositoryCDN
}

export async function fetchRepositoryData(): Promise<HyperAPI.IAppRepository> {
  const repository = await ensureCache('repository_apps', async () => {
    const repositoryCDN = await fetchRepositoryCDN()
    return getFileFromCDN('/index.json', repositoryCDN)
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

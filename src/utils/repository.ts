import { PrismaClient } from '@prisma/client'
import axios from 'axios'

const cdn = 'https://cdn.jsdelivr.net/gh'
const prisma = new PrismaClient()

export function getRepositoryCDN(url: string) {
  const repositoryRegex = /([a-z]+):\/\/([^/]*)\/([^/]*)\/(.*)/
  const repoMatch = url.match(repositoryRegex)

  if (!repoMatch) {
    return url
  }

  const [fullUrl, protocol, domain, user, repository] = repoMatch

  return `${cdn}/${user}/${repository}@master`
}

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

export async function fetchFileFromCDN(path: string) {
  try {
    const url = await fetchRepositoryCDN()
    const response = await axios.get(`${url}${path}`)
    return response.data
  } catch (e) {
    throw new Error(`${e}`)
  }
}

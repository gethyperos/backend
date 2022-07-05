import axios from 'axios'
const cdn = 'https://cdn.jsdelivr.net/gh'

export function getRepositoryCDN(url: string) {
  const repositoryRegex = /([a-z]+):\/\/([^/]*)\/([^/]*)\/(.*)/
  const repoMatch = url.match(repositoryRegex)

  if (!repoMatch) {
    return url
  }

  const [fullUrl, protocol, domain, user, repository] = repoMatch

  return `${cdn}/${user}/${repository}@master`
}

export async function getFileFromCDN(path: string, url: string) {

  try {
    const response = await axios.get(`${url}${path}`)
    return response.data
  } catch (e) {
    throw new Error(`${e}`)
  }
}

export function test() { }

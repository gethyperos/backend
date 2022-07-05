import { getDockerConn } from '@util/docker'

export async function listContainers() {
  const docker = await getDockerConn()
  const apps = await docker.listContainers()

  return apps
}

export async function listImages() {
  const docker = await getDockerConn()
  const images = await docker.listImages()

  return images
}

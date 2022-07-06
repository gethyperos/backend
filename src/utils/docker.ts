import { PrismaClient } from '@prisma/client'
import Docker, { Network } from 'dockerode'
import { arch } from 'os'
import stream from 'stream'

import { ensureCache } from '@root/cache/apiCache'
import { castDockerConn } from '@util/filtering'

const prisma = new PrismaClient()

// async function that waits for a stream to end
export async function waitForStreamEnd(st: NodeJS.ReadableStream) {
  return new Promise((resolve, reject) => {
    st.pipe(new stream.PassThrough())
    st.on('end', () => {
      resolve(true)
    })
    st.on('error', (err) => {
      reject(err)
    })
  })
}

export async function getDockerConn(): Promise<Docker> {
  const conn = await ensureCache('dockerConn', async () => {
    const dockerURI = await prisma.config.findUnique({
      where: {
        key: 'dockerURI',
      },
    })

    if (!dockerURI) {
      throw new Error('Docker URI not found')
    }

    const dockerConn = castDockerConn(dockerURI.value)
    return new Docker(dockerConn)
  })

  return conn
}

export async function addDockerNetwork(name: string) {
  const docker = await getDockerConn()
  const network = await docker.createNetwork({
    Name: name,
    Driver: 'bridge',
  })

  return network
}

export async function removeDockerNetwork(nameOrId: string) {
  const docker = await getDockerConn()
  const network = await docker.getNetwork(nameOrId)

  await network.remove()
}

export async function getNetwork(nameOrId: string) {
  const docker = await getDockerConn()

  const network = await docker.getNetwork(nameOrId)

  return network
}

export async function addDockerContainer(
  containerData: HyperAPI.IDockerContainer,
  networkName?: string
) {
  const docker = await getDockerConn()

  const pullStream = await docker.pull(containerData.Image)

  await waitForStreamEnd(pullStream)
  const container = await docker.createContainer(containerData)

  if (networkName) {
    const network = await getNetwork(networkName)
    await network.connect({
      Container: container.id,
    })
    const bridge = await getNetwork('bridge')
    await bridge.disconnect({
      Container: container.id,
    })
  }
  await container.start()
  return container
}

export async function getContainerState(containerId: string) {
  const docker = await getDockerConn()
  const container = await docker.getContainer(containerId)

  const state = (await container.inspect()).State

  return {
    running: state.Running,
    errored: state.ExitCode !== 0,
    dead: state.Dead,
    paused: state.Paused,
    restarting: state.Restarting,
  }
}

export async function removeDockerContainer(containerId: string) {
  const docker = await getDockerConn()
  const container = await docker.getContainer(containerId)
  const containerState = await getContainerState(containerId)
  if (containerState.running || containerState.paused) {
    await container.stop()
  }

  await container.remove()
}

export function getCompatibleImage(imageList: { x86_64: string; arm?: string; arm64?: string }) {
  const architecture = arch()
  switch (architecture) {
    case 'arm':
      return imageList.arm ?? ''
    case 'arm64':
      return imageList.arm64 ?? ''
    case 'x64':
      return imageList.x86_64 ?? ''
    case 'ia32':
      return imageList.x86_64 ?? ''
    default:
      return imageList.x86_64
  }
}

export function makeContainerData(repositoryApp: HyperOS.IAppRepository) {
  const { Services } = repositoryApp
  const containers: HyperAPI.IDockerContainer[] = []

  Object.keys(Services).forEach(async (serviceName) => {
    const service = Services[serviceName]

    const parsedImage = getCompatibleImage(service.images)
    if (!parsedImage || parsedImage === '') {
      throw new Error('No image found for this platform')
    }

    const parsedEnv = service?.environment?.map((env) => {
      return `${env.name}=${env.value}`
    })

    const parsedVolumes = service?.volumes?.map((volume) => {
      return `${volume.host}:${volume.container}`
    })

    const parsedPorts: { [key: string]: { HostPort: string }[] } = {}
    service.ports?.forEach((port) => {
      parsedPorts[`${port.container}/${port.protocol || 'tcp'}`] = [{ HostPort: port.host }]
    })

    let isPrivileged = false
    if (service.privileged) {
      isPrivileged = service.privileged === 'true'
    }

    const exposedPorts: { [key: string]: {} } = {}
    service.ports?.forEach((port) => {
      exposedPorts[`${port.container}/${port.protocol || 'tcp'}`] = {}
    })

    const containerData: HyperAPI.IDockerContainer = {
      name: `hypros-${service.container_name}`,
      Image: parsedImage,
      HostConfig: {
        Binds: parsedVolumes,
        PortBindings: parsedPorts,
        CapAdd: service.cap_add,
        CapDrop: service.cap_drop,
        Privileged: isPrivileged,
        SecurityOpt: service.security_opt,
      },
      ExposedPorts: exposedPorts,
      Cmd: service.command,
      Env: parsedEnv,
      RestartPolicy: { Name: service.restart },
    }

    containers.push(containerData)
  })

  return containers
}

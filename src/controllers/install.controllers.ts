import { NextFunction, Request, Response } from 'express'
import { checkInstallStatus, startInitialSetup, importContainers } from '@service/install.services'
import { ensureCache } from '@root/cache/apiCache'

export default async function install(req: Request, res: Response, next: NextFunction) {
  const { user, hostname, dockerURI } = req.body

  if (!user) {
    next({ statusCode: 400, message: 'username is required', error: 'Missing field' })
  }
  if (!hostname) {
    next({ statusCode: 400, message: 'hostname is required', error: 'Missing field' })
  }
  if (!dockerURI) {
    next({ statusCode: 400, message: 'dockerURI is required', error: 'Missing field' })
  }

  try {
    await startInitialSetup(user, hostname, dockerURI)
    const importedContainers = await importContainers()
    res
      .status(200)
      .json({ message: `HyperOS is installed - ${importedContainers} containers imported` })
  } catch (e) {
    next({
      statusCode: 500,
      message: 'Installation failed',
      error: `${e}`,
    })
  }
}

export async function checkInstall(req: Request, res: Response, next: NextFunction) {
  try {
    const installStatus = await checkInstallStatus()

    res.status(200).json({
      install_status: installStatus,
      // install_status: false,
    })
  } catch (e) {
    next({
      statusCode: 500,
      message: 'Checking installation status failed',
      error: `${e}`,
    })
  }
}

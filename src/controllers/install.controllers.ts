import { NextFunction, Request, Response } from 'express'
import { checkInstallStatus, startInitialSetup } from '@service/install.services'

export default async function install(req: Request, res: Response, next: NextFunction) {
  const { user, hostname } = req.body

  if (!user) {
    next({ statusCode: 400, message: 'username is required', error: 'Missing field' })
  }
  if (!hostname) {
    next({ statusCode: 400, message: 'hostname is required', error: 'Missing field' })
  }

  try {
    await startInitialSetup(user, hostname)
    res.status(200).json({ message: 'HyperOS is installed' })
  } catch (e) {
    next({
      statusCode: 500,
      message: 'Installation failed',
      error: `${e}`,
    })
  }
}

export async function checkInstall(req: Request, res: Response, next: NextFunction) {
  const status = await checkInstallStatus()

  res.status(200).json({
    install_status: status,
  })
}

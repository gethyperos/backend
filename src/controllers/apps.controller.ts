import { NextFunction, Request, Response } from 'express'

import {
  getAppDB,
  getAppsDB,
  installRepositoryApp,
  uninstallRepositoryApp,
} from '@service/apps.services'

export async function getInstalledApps(req: Request, res: Response, next: NextFunction) {
  try {
    const apps = await getAppsDB()

    res.status(200).json({ apps })
  } catch (e) {
    next({
      statusCode: 500,
      message: 'Failed to get installed apps',
      error: `${e}`,
    })
  }
}

export async function getInstalledApp(req: Request, res: Response, next: NextFunction) {
  const { appId } = req.params

  try {
    const app = await getAppDB(Number(appId))

    res.status(200).json({ app })
  } catch (e) {
    next({
      statusCode: 500,
      message: 'Failed to get app',
      error: `${e}`,
    })
  }
}

export async function installApp(req: Request, res: Response, next: NextFunction) {
  const { App, Services } = req.body as HyperOS.IAppRepository

  if (!App || !Services) {
    next({ statusCode: 400, message: 'App structure is incorrect', error: 'Missing field' })
  }

  try {
    await installRepositoryApp(req.body)

    res.status(200).json({ message: 'App installed' })
  } catch (e) {
    next({
      statusCode: 500,
      message: 'Failed to install app',
      error: `${e}`,
    })
  }
}

export async function uninstallApp(req: Request, res: Response, next: NextFunction) {
  const { appId } = req.params

  if (!appId) {
    next({
      statusCode: 400,
      message: 'App id is missing',
      error: 'Missing field',
    })
  }

  try {
    await uninstallRepositoryApp(Number(appId))
    res.status(200).json({
      message: 'App uninstalled',
    })
  } catch (e) {
    next({
      statusCode: 500,
      message: 'Failed to uninstall app',
      error: `${e}`,
    })
  }
}

export async function buildCustomApp(req: Request, res: Response, next: NextFunction) {
  //
}

export async function updateInstalledApp(req: Request, res: Response, next: NextFunction) {
  //
}

export async function startApp(req: Request, res: Response, next: NextFunction) {
  //
}

export async function stopApp(req: Request, res: Response, next: NextFunction) {
  //
}

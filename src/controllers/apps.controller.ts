import { NextFunction, Request, Response } from 'express'

import { getAppsDB, addApp, removeApp } from '@service/apps.services'
import { ensureCache, clearCache } from '@root/cache/apiCache'

import { searchWithParameters } from '@util/filtering'

export async function getApps(req: Request, res: Response, next: NextFunction) {
  const filter = req.query
  const { appId } = req.params

  try {
    const apps = await ensureCache('installedApps', async () => {
      const result = await getAppsDB()
      return result
    })
    const filteredApps = searchWithParameters(appId ? { appId } : filter, apps)

    res.status(200).json({ apps: filteredApps })
  } catch (e) {
    next({
      statusCode: 500,
      message: 'Failed to get installed apps',
      error: `${e}`,
    })
  }
}

export async function installApp(req: Request, res: Response, next: NextFunction) {
  const { App, Services } = req.body as HyperOS.IAppRepository

  if (!App || !Services) {
    next({ statusCode: 400, message: 'App structure is incorrect', error: 'Missing field' })
  }

  clearCache('installedApps')

  try {
    await addApp(req.body)
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

  clearCache('installedApps')

  try {
    await removeApp(Number(appId))
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

export async function installCustomApp(req: Request, res: Response, next: NextFunction) {
  //
}

export async function updateApp(req: Request, res: Response, next: NextFunction) {
  clearCache('installedApps')
}

export async function startApp(req: Request, res: Response, next: NextFunction) {
  //
}

export async function stopApp(req: Request, res: Response, next: NextFunction) {
  //
}

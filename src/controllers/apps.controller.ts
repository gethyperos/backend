/* eslint-disable prettier/prettier */
/* eslint-disable no-nested-ternary */
import { NextFunction, Request, Response } from 'express'
import type { App as AppDB } from '@prisma/client'

import { getAppsDB, addApp, removeApp, updateAppDB, getAppDB, removeAppDB } from '@service/apps.services'
import { ensureCache, clearCache } from '@root/cache/apiCache'

import { searchWithParameters } from '@util/filtering'
import { getContainer, getContainerState } from '@util/docker'
import { asyncForEach } from '@util/general'
import { importContainers } from '@service/install.services'


export async function getApps(req: Request, res: Response, next: NextFunction) {
  const filter = req.query
  const { appId } = req.params

  try {
    const apps = await ensureCache('installedApps', async () => {
      const result = await getAppsDB()
      return result
    })

    interface AppStateData extends AppDB {
      state: 'running' | 'dead' | 'paused' | 'restarting' | 'error' | 'stopped'
    }

    const filteredApps = searchWithParameters<AppStateData>(appId ? { id: appId } : filter, apps)

    await asyncForEach(filteredApps, async (app, index) => {
      await asyncForEach(app.container.split(','), async container => {
        const appState = await getContainerState(container)
        if (appState.dead) { filteredApps[index].state = 'dead'; return }
        if (appState.restarting) { filteredApps[index].state = 'restarting'; return }
        if (appState.paused) { filteredApps[index].state = 'paused'; return }
        if (appState.errored) { filteredApps[index].state = 'error'; return }
        if (appState.errored) { filteredApps[index].state = 'stopped'; return }

        filteredApps[index].state = appState.running ? 'running' : 'stopped'
      })
    })

    res.status(200).json({ apps: filteredApps })
  } catch (e: any) {
    if (String(e).includes('No such container:')) {
      const containerID = String(e).split('No such container:')[1].trim()

      try {
        await removeAppDB(undefined, containerID)
        await clearCache('installedApps')
        next(getApps(req, res, next))
      } catch (err) {
        next({
          statusCode: 500,
          message: `Found invalid/remove container: ${containerID} - unable to remove from database`,
          error: `${err}`,
        })
      }
    }
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
    const app = await addApp(req.body)
    res.status(200).json({ message: 'App installed', app })
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
  const { appId } = req.params

  if (!appId) {
    next({
      statusCode: 400,
      message: 'AppId is missing',
      error: 'Missing field',
    })
  }

  try {
    const app = await updateAppDB(Number(appId), req.body)
    clearCache('installedApps')
  } catch (e) {
    next({
      statusCode: 500,
      message: 'Failed to update app',
      error: `${e}`,
    })
  }
}

export async function getAppState(req: Request, res: Response, next: NextFunction) {
  const { appId } = req.params

  if (!appId) {
    next({
      statusCode: 400,
      message: 'AppId is missing',
      error: 'Missing field',
    })
  }

  try {
    const app = await getAppDB(Number(appId))
    if (!app) {
      next({
        statusCode: 404,
        message: 'App not found',
        error: 'App not found',
      })
      return
    }

    let state: string = ''
    await asyncForEach(app.container.split(','), async container => {
      const appState = await getContainerState(container)
      if (appState.dead) { state = 'dead' }
      if (appState.restarting) { state = 'restarting' }
      if (appState.paused) { state = 'paused' }
      if (appState.errored) { state = 'error' }

      state = 'running'
    })

    res.status(200).json({
      state,
      id: app.id,
      name: app.name,
      container: app.container,
      icon: app.icon,
      port: app.port,
      network: app.network,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt
    })
  } catch (e) {
    next({
      statusCode: 500,
      message: 'Failed to get app state',
      error: `${e}`,
    })
  }
}


export async function startApp(req: Request, res: Response, next: NextFunction) {
  const { appId } = req.params

  try {
    const app = await getAppDB(Number(appId))
    if (!app) {
      next({
        statusCode: 404,
        message: 'App not found',
        error: 'App not found',
      })
      return
    }

    await asyncForEach(app.container.split(','), async id => {
      const container = await getContainer(id)

      await container.start()
    })

    res.status(200).json({ message: 'App started' })
  } catch (e) {
    next({
      statusCode: 500,
      message: 'Failed to start app',
      error: `${e}`,
    })
  }
}

export async function stopApp(req: Request, res: Response, next: NextFunction) {
  const { appId } = req.params

  try {
    const app = await getAppDB(Number(appId))
    if (!app) {
      next({
        statusCode: 404,
        message: 'App not found',
        error: 'App not found',
      })
      return
    }

    await asyncForEach(app.container.split(','), async id => {
      const container = await getContainer(id)

      await container.stop()
    })

    res.status(200).json({ message: 'App stopped' })
  } catch (e) {
    next({
      statusCode: 500,
      message: 'Failed to stop app',
      error: `${e}`,
    })
  }
}
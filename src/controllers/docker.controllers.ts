import { NextFunction, Request, Response } from 'express'
import { listContainers, listImages } from '@service/docker.services'

export async function listRunningContainers(req: Request, res: Response, next: NextFunction) {
  try {
    const apps = await listContainers()
    res.json({ apps })
  } catch (e) {
    next({
      statusCode: 500,
      message: `${e}`,
      error: 'Unable to fetch installed apps',
    })
  }
}

export async function listDownloadedImages(req: Request, res: Response, next: NextFunction) {
  try {
    const apps = await listImages()
    res.json({ apps })
  } catch (e) {
    next({
      statusCode: 500,
      message: `${e}`,
      error: 'Unable to fetch installed apps',
    })
  }
}

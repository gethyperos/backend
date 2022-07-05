import { NextFunction, Request, Response } from 'express'
import { listContainers, listImages } from '@service/docker.services'
import { searchWithParameters } from '@util/filtering'

export async function getContainers(req: Request, res: Response, next: NextFunction) {
  const { containerId } = req.params
  const filters = req.query

  try {
    const containers = await listContainers()
    const filteredContainers = searchWithParameters(
      containerId ? { Id: containerId } : filters,
      containers
    )

    res.json({ containers: filteredContainers })
  } catch (e) {
    next({
      statusCode: 500,
      message: `${e}`,
      error: 'Unable to retrieve containers',
    })
  }
}

export async function getImages(req: Request, res: Response, next: NextFunction) {
  const { imageId } = req.params
  const filters = req.query

  try {
    const images = await listImages()
    const filteredImages = searchWithParameters(imageId ? { Id: imageId } : filters, images)
    res.json({ images: filteredImages })
  } catch (e) {
    next({
      statusCode: 500,
      message: `${e}`,
      error: 'Unable to fetch installed apps',
    })
  }
}

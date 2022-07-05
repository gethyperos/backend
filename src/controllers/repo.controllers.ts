import { fetchRepositoryData, fetchRepositoryFile } from '@service/repo.services'
import { searchWithParameters } from '@util/filtering'
import { NextFunction, Request, Response } from 'express'

export async function getRepositoryApps(req: Request, res: Response, next: NextFunction) {
  try {
    const repository = await fetchRepositoryData()
    const filteredRepository = searchWithParameters(req.query, repository)

    res.json({
      apps: filteredRepository,
    })
  } catch (e) {
    next({
      statusCode: 500,
      message: 'unable to parse repository',
      error: `${e}`,
    })
  }
}

export async function getRepositoryApp(req: Request, res: Response, next: NextFunction) {
  const { appId } = req.params

  if (!appId) {
    next({
      statusCode: 400,
      error: 'Missing field',
      message: 'appId field is required',
    })
  }

  try {
    const repository = await fetchRepositoryData()
    const filteredRepository = searchWithParameters({ id: appId }, repository)

    res.json({
      apps: filteredRepository,
    })
  } catch (e) {
    next({
      statusCode: 500,
      message: 'unable to parse repository',
      error: `${e}`,
    })
  }
}

export async function getAppStatic(req: Request, res: Response, next: NextFunction) {
  const { app } = req.params
  const { path } = req.query

  if (!path) {
    next({
      statusCode: 400,
      error: 'Missing field',
      message: 'path field is required',
    })
  }

  if (!app) {
    next({
      statusCode: 400,
      error: 'Missing param',
      message: 'app param is required',
    })
  }

  try {
    const file = await fetchRepositoryFile(app as string, path as string)
    // res.status(200).json({
    //   fileURL: file
    // })
    res.status(301).redirect(file)
  } catch (e) {
    next({
      statusCode: 500,
      message: 'unable to parse repository file',
      error: `${e}`,
    })
  }
}

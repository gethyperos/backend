import { ensureCache } from '@root/cache/apiCache'
import { fetchRepositoryData, fetchRepositoryFile } from '@service/repo.services'
import { searchWithParameters } from '@util/filtering'
import { fetchFileFromCDN, fetchRepositoryCDN } from '@util/repository'
import { NextFunction, Request, Response } from 'express'

export async function getRepositoryApps(req: Request, res: Response, next: NextFunction) {
  const filter = req.query
  const { appId } = req.params

  try {
    const repository = await ensureCache('repositoryApps', async () => {
      const result = fetchRepositoryData()
      return result
    })

    const filteredRepository = searchWithParameters(appId ? { id: appId } : filter, repository)

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

export async function getRepositoryCategories(req: Request, res: Response, next: NextFunction) {
  const filter = req.query
  const { categoryName } = req.params

  try {
    const categories = await ensureCache('repositoryCategories', async () => {
      const result = await fetchFileFromCDN('/categories.json')
      return result
    })

    const filteredCategories = searchWithParameters(
      categoryName ? { name: categoryName } : filter,
      categories
    )

    res.status(200).json({
      categories: filteredCategories,
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

export async function getRepository(req: Request, res: Response, next: NextFunction) {
  try {
    const repository = await fetchRepositoryCDN()

    res.status(200).json({
      url: repository,
      apps: `${repository}/index.json`,
      categories: `${repository}/categories.json`,
    })
  } catch (e) {
    next({
      statusCode: 500,
      message: 'unable to parse repository file',
      error: `${e}`,
    })
  }
}

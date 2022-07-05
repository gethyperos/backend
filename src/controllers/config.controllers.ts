import { NextFunction, Request, Response } from 'express'

import { getConfigsDB } from '@service/config.services'
import { searchWithParameters } from '@util/filtering'
import { ensureCache } from '@root/cache/apiCache'

export async function getConfigs(req: Request, res: Response, next: NextFunction) {
  try {
    const configs = await ensureCache('systemConfigs', async () => {
      const configsDB = getConfigsDB()
      return configsDB
    })

    res.status(200).json({
      configs,
    })
  } catch (e) {
    next({
      statusCode: 500,
      error: `${e}`,
      message: 'Failed to retrieve configs.',
    })
  }
}

export async function getConfigByKey(req: Request, res: Response, next: NextFunction) {
  const { key } = req.params

  try {
    const configs = await ensureCache('systemConfigs', async () => {
      const configsDB = getConfigsDB()
      return configsDB
    })

    const config = searchWithParameters(configs, { key })

    if (!config) {
      throw new Error('Config not found')
    }

    res.status(200).json({
      config,
    })
  } catch (e) {
    next({
      statusCode: 404,
      error: `${e}`,
      message: 'Unable to retrieve config.',
    })
  }
}

export async function removeConfig() {
  // TODO
}

export async function updateConfig() {
  // TODO
}

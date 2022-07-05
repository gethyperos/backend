import { NextFunction, Request, Response } from 'express'

import { getConfigsDB } from '@service/config.services'
import { searchWithParameters } from '@util/filtering'
import { ensureCache } from '@root/cache/apiCache'

export async function getConfigs(req: Request, res: Response, next: NextFunction) {
  const filter = req.query
  const { configKey } = req.params

  try {
    const configs = await ensureCache('systemConfigs', async () => {
      const configsDB = getConfigsDB()
      return configsDB
    })

    const filteredConfigs = searchWithParameters(configKey ? { key: configKey } : filter, configs)
    res.status(200).json({
      configs: filteredConfigs,
    })
  } catch (e) {
    next({
      statusCode: 500,
      error: `${e}`,
      message: 'Failed to retrieve configs.',
    })
  }
}

export async function removeConfig() {
  // TODO
}

export async function updateConfig() {
  // TODO
}

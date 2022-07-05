import { NextFunction, Request, Response } from "express"

import { getFilteredConfigsDB } from "@service/config.services"

export async function listConfigs(req: Request, res: Response, next: NextFunction) {
  const filters = req.query

  const configs = await getFilteredConfigsDB(filters)

  res.json({
    configs
  });
}

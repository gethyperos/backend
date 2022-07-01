import { Request, Response, NextFunction } from 'express'
import signale from 'signale'

export default function logMiddleware(req: Request, res: Response, next: NextFunction) {
  const logger = signale.scope(req.method)
  logger.log(`${req.path}\n└─ Params ${JSON.stringify(req.params)}`)
  next()
}

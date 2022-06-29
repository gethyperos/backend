import { Request, Response, NextFunction } from 'express'
import signale from 'signale'

export default function errorMiddleware(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const logger = signale.scope(req.method)
  logger.error({ prefix: req.path, message: error.message })
  res.status(error.status || 500).json({ error: error.message })
  next()
}

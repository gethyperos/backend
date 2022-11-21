import { Request, Response, NextFunction } from 'express'
import signale from 'signale'

export default async function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const logger = new signale.Signale({
    scope: `${req.method} > ${req.path}`,
  })

  logger.error({
    message: err.message,
  })

  res.status(err.statusCode || 500).json({
    message: err.message,
    error: err.error || 'Unknown error',
  })
}

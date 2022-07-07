import express from 'express'
import helmet from 'helmet'
import dotenv from 'dotenv'
import cors from 'cors'

import authRoutes from '@route/auth.routes'
import appRoutes from '@route/app.routes'
import repoRoutes from '@route/repo.routes'
import userRoutes from '@route/user.routes'
import systemRoutes from '@route/system.routes'
import setupRoutes from '@route/setup.routes'
import staticRoutes from '@route/static.routes'

import logMiddleware from '@middleware/log.middleware'
import errorMiddleware from '@middleware/error.middleware'

const app = express()

dotenv.config()

app.use(helmet())
app.use(
  cors({
    origin: '*',
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(logMiddleware)

app.use('/auth', authRoutes)
app.use('/apps', appRoutes)
app.use('/repo', repoRoutes)
app.use('/users', userRoutes)
app.use('/system', systemRoutes)
app.use('/install', setupRoutes)
app.use('/static', staticRoutes)

app.use(errorMiddleware)

export default app

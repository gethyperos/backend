import express from 'express'
import helmet from 'helmet'
import dotenv from 'dotenv'

import userRoutes from '@route/user.routes'
import appRoutes from '@route/app.routes'
import systemRoutes from '@route/system.routes'
import authRoutes from '@route/auth.routes'

import errorMiddleware from '@middleware/error.middleware'
import logMiddleware from '@middleware/log.middleware'

const app = express()

dotenv.config()

app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(logMiddleware)

app.use('/auth', authRoutes)
app.use('/app', appRoutes)
app.use('/users', userRoutes)
app.use('/system', systemRoutes)

app.use(errorMiddleware)

export default app

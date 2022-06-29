import express from 'express'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'

import userRoutes from '@route/user.routes'

import errorMiddleware from '@middleware/error.middleware'

const app = express()

dotenv.config()

app.use(helmet())
app.use(bodyParser)

app.use('/app')
app.use('/user', userRoutes)
app.use('/system')

app.use(errorMiddlware)

export default app

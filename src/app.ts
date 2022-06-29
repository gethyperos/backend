import express from 'express'
import helmet from 'helmet'
import dotenv from 'dotenv'

import bodyParser from 'body-parser'
import userRoutes from '@route/user.routes'

const app = express()

dotenv.config()

app.use(helmet())
app.use(bodyParser)

app.use('/app')
app.use('/user', userRoutes)
app.use('/system')

export default app

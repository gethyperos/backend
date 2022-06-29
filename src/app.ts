import express from 'express'
import helmet from 'helmet'
import dotenv from 'dotenv'

const app = express()

dotenv.config()
app.use(helmet())

export default app

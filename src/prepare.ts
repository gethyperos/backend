/* eslint-disable no-loop-func */
/* eslint-disable no-restricted-syntax */
import { v4 as uuidv4 } from 'uuid'
import { appendFileSync } from 'fs'
import signale from 'signale'
import dotenv from 'dotenv'

dotenv.config()

const token = process.env.JWT_SECRET
const dbURL = process.env.DATABASE_URL
const interactiveLog = new signale.Signale({ interactive: true })

if (!token) {
  interactiveLog.error('[%d/3] JWT_SECRET is not defined', 1)
  interactiveLog.start('[%d/3] Generating token...', 2)
  const generatedToken = uuidv4()
  interactiveLog.success(`[%d/3] Token generated: ${generatedToken}`, 3)

  appendFileSync('.env', `JWT_SECRET="${generatedToken}"\n`)
  process.env.JWT_SECRET = generatedToken
}

if (!dbURL) {
  interactiveLog.error('[%d/3] DATABASE_URL is not defined', 1)
  interactiveLog.start('[%d/3] Setting path...', 2)
  appendFileSync('.env', 'DATABASE_URL="file:db.sqlite"\n')
  interactiveLog.success('[%d/3] Database path configured', 3)

  process.env.DATABASE_URL = 'db.sqlite'
}

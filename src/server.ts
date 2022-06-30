import { internalIpV4 } from 'internal-ip'
import signale from 'signale'
import dotenv from 'dotenv'
import { v4 as uuidv4 } from 'uuid'
import { appendFileSync } from 'fs'
import app from './app'

dotenv.config()

const port = process.env.PORT || 5001
const token = process.env.JWT_SECRET
const interactiveLog = new signale.Signale({ interactive: true })
const logger = new signale.Signale()

if (!token) {
  interactiveLog.error('[%d/3] JWT_SECRET is not defined', 1)
  interactiveLog.start('[%d/3] Generating token...', 2)
  const generatedToken = uuidv4()
  interactiveLog.success(`[%d/3] Token generated: ${generatedToken}`, 3)

  appendFileSync('.env', `\nJWT_SECRET="${generatedToken}"`)
  process.env.JWT_SECRET = generatedToken
}

app.listen(port, () => {
  internalIpV4().then((internalIP) => {
    const scope = logger.scope('⚡ HyperOS')
    scope.log({
      prefix: 'Listening on',
      message: `\n├─ http://${internalIP}:${port}\n└─ http://localhost:${port}`,
      scope: 'Core',
    })
  })
})

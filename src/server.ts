import { internalIpV4 } from 'internal-ip'
import logger from 'signale'
import dotenv from 'dotenv'
import app from './app'

dotenv.config()

const port = process.env.PORT || 5001
const token = process.env.JWT_SECRET

if (!token) {
  logger.error('JWT_SECRET is not defined')
  process.exit(1)
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

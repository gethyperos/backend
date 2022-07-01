import { internalIpV4 } from 'internal-ip'
import signale from 'signale'
import dotenv from 'dotenv'
import app from './app'

dotenv.config()

const port = process.env.PORT || 5001
const logger = new signale.Signale()

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

import { internalIpV4 } from 'internal-ip'
import logger from 'signale'
import app from './app'

const port = process.env.PORT || 5001

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

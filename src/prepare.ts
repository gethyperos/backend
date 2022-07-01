/* eslint-disable no-loop-func */
/* eslint-disable no-restricted-syntax */
import { v4 as uuidv4 } from 'uuid'
import { appendFileSync } from 'fs'
import { PrismaClient } from '@prisma/client'
import { readJSON } from '@util/files'
import signale from 'signale'

const token = process.env.JWT_SECRET
const interactiveLog = new signale.Signale({ interactive: true })
const prisma = new PrismaClient()

if (!token) {
  interactiveLog.error('[%d/3] JWT_SECRET is not defined', 1)
  interactiveLog.start('[%d/3] Generating token...', 2)
  const generatedToken = uuidv4()
  interactiveLog.success(`[%d/3] Token generated: ${generatedToken}`, 3)

  appendFileSync('.env', `\nJWT_SECRET="${generatedToken}"`)
  process.env.JWT_SECRET = generatedToken
}

prisma.config.findMany().then(async (configList) => {
  const baseConfig = await readJSON('settings.json')
  const missingConfigs = Object.keys(baseConfig).filter((configKey) => {
    return !configList.find((c) => c.key === configKey)
  })

  if (missingConfigs.length > 0) {
    let stepCount = 1
    for (const k of missingConfigs) {
      interactiveLog.await(`[%d/${missingConfigs.length * 3}] Initializing config ${k}`, stepCount)
      stepCount += 1
      prisma.config
        .create({
          data: {
            key: k,
            value: baseConfig[k].value,
            type: baseConfig[k].type,
          },
        })
        .then(() => {
          interactiveLog.success(
            `[%d/${missingConfigs.length * 3}] Missing config ${k} added`,
            stepCount
          )
          stepCount += 1
          if (stepCount === missingConfigs.length * 3) {
            interactiveLog.info(`[%d/${missingConfigs.length * 3}] Configs initialized`, stepCount)
          }
        })
    }
  }
})

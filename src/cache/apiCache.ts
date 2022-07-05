import NodeCache from 'node-cache'

const cache = new NodeCache({ stdTTL: 60 * 60 * 3, deleteOnExpire: true }) // expires in 3 hours

export const cacheList: { [key: string]: NodeCache } = {}

export async function ensureCache(key: string, dataFetch?: () => Promise<any>): Promise<any> {
  try {
    const currentCache = cache.get(key)

    if (currentCache) {
      return cache.get(key) as NodeCache
    }

    if (!currentCache && dataFetch) {
      const data = await dataFetch()
      cache.set(key, data)

      return cache.get(key) as NodeCache
    }

    return cache.get(key) as NodeCache
  } catch (e) {
    throw new Error(`${e}`)
  }
}



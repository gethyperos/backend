// function that receives express query parameters and returns a filtered array of objects that matches the query parameters
interface RequestQuery {
  [key: string]: undefined | string | string[] | RequestQuery | RequestQuery[]
}

export function intersection<T>(a: T[], b: T[]): T[] {
  return a.filter((x) => b.includes(x))
}

export function searchWithParameters<T>(filters: RequestQuery, objects: any): T[] {
  const filteredObjects = objects.filter((object: any) => {
    let isValid = true
    // eslint-disable-next-line no-restricted-syntax
    for (const key in filters) {
      if (Array.isArray(object[key])) {
        const filterValue = filters[key] as string
        const objectBase = object[key] as any[]
        const intersected = intersection(objectBase, filterValue.split(','))

        if (intersected.length === 0 || intersected.length !== filterValue.split(',').length) {
          isValid = false
        }
        // eslint-disable-next-line eqeqeq
      } else if (filters[key] != object[key]) {
        isValid = false
      }
    }
    return isValid
  })
  return filteredObjects
}

export function castValueType(value: any, type: string) {
  switch (type) {
    case 'string':
      return value.toString()
    case 'number':
      return Number(value)
    case 'boolean':
      return Boolean(value)
    case 'array':
      return value.split(',')
    default:
      return String(value)
  }
}

export function castTypeValue(value: any) {
  switch (typeof value) {
    case 'string':
      return 'string'
    case 'number':
      return 'number'
    case 'boolean':
      return 'number'
    default:
      return Array.isArray(value) ? 'array' : typeof value
  }
}

export function castConfigData(key: string, value: number | string | boolean | any[]) {
  const typeCast = castTypeValue(value)
  const valueCast = Array.isArray(value) ? value.join(',') : String(value)

  return {
    key,
    value: valueCast,
    type: typeCast,
  }
}

export function castDockerConn(
  str: string
): { socketPath: string } | { protocol: 'http'; host: string; port: string } {
  const unixPathRegex =
    /((\.{2}\/{1})+|((\.{1}\/{1})?)|(\/{1}))(([a-zA-Z0-9]+\/{1})+)([a-zA-Z0-9])+(\.{1}[a-zA-Z0-9]+)?$/

  // Given URI is a unix socket (unix path)
  if (unixPathRegex.test(str)) {
    if (!str.endsWith('.sock')) {
      throw new Error('Invalid path for Socket URI')
    }

    return {
      socketPath: str,
    }
  }
  if (!str.startsWith('http://')) {
    throw new Error('Invalid protocol for Docker URI')
  }
  return {
    protocol: 'http',
    host: str.replace('http://', '').split(':')[0],
    port: str.replace('http://', '').split(':')[1],
  }
}

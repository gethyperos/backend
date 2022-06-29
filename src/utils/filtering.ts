// function that receives express query parameters and returns a filtered array of objects that matches the query parameters
interface RequestQuery {
  [key: string]: undefined | string | string[] | RequestQuery | RequestQuery[]
}

export default function searchWithParameters(filters: RequestQuery, objects: any) {
  const filteredObjects = objects.filter((object: any) => {
    let isValid = true
    // eslint-disable-next-line no-restricted-syntax
    for (const key in filters) {
      if (filters[key] !== object[key]) {
        isValid = false
      }
    }
    return isValid
  })

  return filteredObjects
}

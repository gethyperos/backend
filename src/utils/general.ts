/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */

export async function asyncForEach<T>(array: Array<T>, callback: (item: T, index: number) => void) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index)
  }
}

// async timeout function
export async function timeout(ms: number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Timeout exceeded')
    }, ms)
  })
}

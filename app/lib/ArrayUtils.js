/* @flow */

// @TODO: flowtype for arr and return
export const getNextCircular = (arr: [], index: number) : ?any => {
  return getCircular(arr, index + 1)
}

// @TODO: flowtype for arr and return
export const getPrevCircular = (arr: [], index: number) : ?any => {
  return getCircular(arr, index - 1)
}

// @TODO: flowtype for arr and return 
const getCircular = (arr: [], index: number) : ?any => {
  if (arr.length === 0) return undefined
  const indexMod = index % arr.length
  const indexAbs = indexMod < 0 ? arr.length - (-indexMod) : indexMod
  return arr[indexAbs]
}

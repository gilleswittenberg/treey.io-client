/* @flow */

export const getNextCircular = (arr: [], index: number) : ?mixed => {
  return getCircular(arr, index + 1)
}

export const getPrevCircular = (arr: [], index: number) : ?mixed => {
  return getCircular(arr, index - 1)
}

const getCircular = (arr: [], index: number) : ?mixed => {
  if (arr.length === 0) return undefined
  const indexMod = index % arr.length
  const indexAbs = indexMod < 0 ? arr.length - (-indexMod) : indexMod
  return arr[indexAbs]
}

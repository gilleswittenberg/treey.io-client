/* @flow */

export default function isURL (str: string) : boolean {
  const regexp = /^https?:\/\//
  return regexp.test(str)
}

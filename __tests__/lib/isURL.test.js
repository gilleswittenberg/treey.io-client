/* @flow */

// @TODO: clean up
declare var describe: any
declare var it: any
declare var expect: any

import isURL from '../../app/lib/isURL'

describe('isURL', () => {

  it('http://', () => {
    expect(isURL('http://treey.io')).toBe(true)
  })

  it('https://', () => {
    expect(isURL('https://treey.io')).toBe(true)
  })

  it('string', () => {
    expect(isURL('string')).toBe(false)
  })
})

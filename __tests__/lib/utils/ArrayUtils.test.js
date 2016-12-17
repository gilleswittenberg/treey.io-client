/* @flow */

// required for Flow type
declare var describe: any
declare var it: any
declare var expect: any

import { getNextCircular, getPrevCircular } from '../../../app/lib/utils/ArrayUtils'

describe('ArrayUtils', () => {

  describe('getNextCircular', () => {
    it('empty array', () => {
      expect(getNextCircular([], 0)).toBe(undefined)
    })

    it('in array', () => {
      expect(getNextCircular(['a', 'b', 'c'], 1)).toBe('c')
    })

    it('last index', () => {
      const arr = ['a', 'b', 'c', 'd']
      expect(getNextCircular(arr, arr.length - 1)).toBe('a')
    })

    it('modulus', () => {
      expect(getNextCircular(['a', 'b', 'c', 'd', 'e'], 7)).toBe('d')
    })
  })

  describe('getPrevCircular', () => {

    it('empty array', () => {
      expect(getPrevCircular([], 0)).toBe(undefined)
    })

    it('in array', () => {
      expect(getPrevCircular(['a', 'b', 'c'], 1)).toBe('a')
    })

    it('first index', () => {
      const arr = ['a', 'b', 'c', 'd']
      expect(getPrevCircular(arr, 0)).toBe('d')
    })

    it('modulus', () => {
      expect(getPrevCircular(['a', 'b', 'c', 'd', 'e'], 9)).toBe('d')
    })
  })
})

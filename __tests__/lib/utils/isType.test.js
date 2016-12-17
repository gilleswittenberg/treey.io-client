/* @flow */

// required for Flow type
declare var describe: any
declare var it: any
declare var expect: any

import isType from '../../../app/lib/utils/isType'

describe('isType', () => {

  describe('boolean', () => {

    it('true', () => {
      expect(isType('boolean', true)).toBe(true)
    })

    it('false', () => {
      expect(isType('boolean', false)).toBe(true)
    })

    it('string', () => {
      expect(isType('boolean', 'true')).toBe(false)
    })
  })

  describe('number', () => {

    it('int', () => {
      expect(isType('number', 2)).toBe(true)
    })

    it('float', () => {
      expect(isType('number', 2.3)).toBe(true)
    })

    it('string', () => {
      expect(isType('number', 'true')).toBe(false)
    })
  })

  describe('string', () => {

    it('empty', () => {
      expect(isType('string', '')).toBe(true)
    })

    it('str', () => {
      expect(isType('string', 'str')).toBe(true)
    })

    it('number', () => {
      expect(isType('string', 2)).toBe(false)
    })
  })

  describe('boolean[]', () => {

    it('empty', () => {
      expect(isType('boolean[]', [])).toBe(true)
    })

    it('non empty', () => {
      expect(isType('boolean[]', [false, true])).toBe(true)
    })

    it('number array', () => {
      expect(isType('boolean[]', [2])).toBe(false)
    })

    it('mixed array', () => {
      expect(isType('boolean[]', [true, 2])).toBe(false)
    })
  })

  describe('number[]', () => {

    it('empty', () => {
      expect(isType('number[]', [])).toBe(true)
    })

    it('non empty', () => {
      expect(isType('number[]', [2, 3.4])).toBe(true)
    })

    it('number array', () => {
      expect(isType('number[]', ['2'])).toBe(false)
    })

    it('mixed array', () => {
      expect(isType('number[]', [1, '2'])).toBe(false)
    })
  })

  describe('string[]', () => {

    it('empty', () => {
      expect(isType('string[]', [])).toBe(true)
    })

    it('non empty', () => {
      expect(isType('string[]', ['str'])).toBe(true)
    })

    it('number array', () => {
      expect(isType('string[]', [2])).toBe(false)
    })

    it('mixed array', () => {
      expect(isType('string[]', ['str', 2])).toBe(false)
    })
  })
})

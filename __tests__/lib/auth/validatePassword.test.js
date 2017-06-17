/* @flow */

// Required for Flow type
declare var describe: any
declare var it: any
declare var expect: any

import validatePassword from '../../../app/lib/auth/validatePassword'

describe('validate password', () => {

  describe('invalid', () => {

    it('undefined', () => {
      expect(validatePassword(undefined)).toBe(false)
    })

    it('non string', () => {
      expect(validatePassword(2)).toBe(false)
    })

    it('length 7', () => {
      expect(validatePassword('1234567')).toBe(false)
    })
  })

  describe('valid', () => {

    it('length 8', () => {
      expect(validatePassword('12345678')).toBe(true)
    })
  })
})

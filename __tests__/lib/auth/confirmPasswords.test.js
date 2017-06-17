/* @flow */

// Required for Flow type
declare var describe: any
declare var it: any
declare var expect: any

import confirmPasswords from '../../../app/lib/auth/confirmPasswords'

describe('confirm passwords', () => {

  describe('invalid', () => {

    it('undefined password', () => {
      expect(confirmPasswords(undefined, undefined)).toBe(false)
    })

    it('undefined passwordConfirm', () => {
      expect(confirmPasswords(undefined, undefined)).toBe(false)
    })

    it('undefined both', () => {
      expect(confirmPasswords(undefined, undefined)).toBe(false)
    })

    it('not equal', () => {
      expect(confirmPasswords('a', 'b')).toBe(false)
    })
  })

  describe('valid', () => {

    it('equal', () => {
      expect(confirmPasswords('12345678', '12345678')).toBe(true)
    })
  })
})

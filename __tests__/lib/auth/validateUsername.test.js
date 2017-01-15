import validateUsername from '../../../app/lib/auth/validateUsername'

describe('validate username', () => {

  describe('invalid', () => {

    it('undefined', () => {
      expect(validateUsername(undefined)).toBe(false)
    })

    it('length 1', () => {
      expect(validateUsername('a')).toBe(false)
    })

    it('non alpha numeric', () => {
      expect(validateUsername('--')).toBe(false)
    })
  })

  describe('valid', () => {

    it('length 2', () => {
      expect(validateUsername('ab')).toBe(true)
    })

    it('capitalized', () => {
      expect(validateUsername('ABC')).toBe(true)
    })

    it('name', () => {
      expect(validateUsername('JohnDoe')).toBe(true)
    })
  })
})

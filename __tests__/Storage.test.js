import Storage, { keys } from '../app/lib/Storage'

const key = keys[0]

jest.genMockFromModule('../__mocks__/localStorage')

describe('Storage', () => {

  beforeEach(() => {
    Storage.clear()
  })

  describe('clear', () => {

    it('return boolean', () => {
      expect(Storage.clear()).toEqual(true)
    })
  })

  describe('set', () => {

    it('non allowed key', () => {
      expect(Storage.set('non-allowed-key', {})).toEqual(false)
    })

    it('return boolean', () => {
      expect(Storage.set(key, {})).toEqual(true)
    })
  })

  describe('get', () => {

    it('non allowed key', () => {
      expect(Storage.get('non-allowed-key', {})).toEqual(false)
    })

    it('non valid object', () => {
      Storage.set(key, { k: 'v' })
      expect(Storage.get(key)).toEqual(false)
    })

    it('non valid array', () => {
      Storage.set(key, [1, 2])
      expect(Storage.get(key)).toEqual(false)
    })

    it('valid', () => {
      Storage.set(key, ['s', 't'])
      expect(Storage.get(key)).toEqual(['s', 't'])
    })
  })
})

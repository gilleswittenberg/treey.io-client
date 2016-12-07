/* @flow */

// @TODO: clean up
declare var jest: any
declare var beforeEach: any
declare var describe: any
declare var it: any
declare var expect: any

import Storage from '../../app/lib/Storage'

jest.genMockFromModule('../../__mocks__/localStorage')

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

    it('return boolean', () => {
      expect(Storage.set('key', {})).toEqual(true)
    })
  })

  describe('get', () => {

    it('no type', () => {
      Storage.set('key', 'value')
      expect(Storage.get('key')).toEqual('value')
    })

    it('type string', () => {
      Storage.set('key', 'value')
      expect(Storage.get('key', 'string')).toEqual('value')
    })

    it('invalid type string', () => {
      Storage.set('key', 2)
      expect(Storage.get('key', 'string')).toBe(false)
    })

    it('type string[]', () => {
      Storage.set('key', ['val', 'two'])
      expect(Storage.get('key', 'string[]')).toEqual(['val', 'two'])
    })

    it('invalid type string[]', () => {
      Storage.set('key', [2, 'two'])
      expect(Storage.get('key', 'string[]')).toBe(false)
    })
  })
})

/* @flow */

// Required for Flow type
declare var describe: any
declare var it: any
declare var expect: any

import __ from '../../../app/lib/utils/i18n'

describe('i18n', () => {

  describe('messages', () => {

    it('undefined language', () => {
      expect(__('nl', 'EDIT')).toBe('__ nl EDIT __')
    })

    it('undefined key', () => {
      expect(__('en', 'UNDEFINED')).toBe('__ UNDEFINED __')
    })
  })

  describe('key', () => {

    it('string', () => {
      expect(__('en', 'EDIT')).toBe('edit')
    })
  })
})

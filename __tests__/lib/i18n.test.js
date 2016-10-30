import __ from '../../app/lib/i18n'

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

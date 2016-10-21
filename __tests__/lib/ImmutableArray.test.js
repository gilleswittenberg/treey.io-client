import ImmutableArray from '../../app/lib/ImmutableArray'

describe('ImmutableArray', () => {

  describe('remove', () => {

    it('non existing', () => {
      expect(ImmutableArray.remove([], 'abc')).toEqual([])
    })

    it('value', () => {
      expect(ImmutableArray.remove(['abc'], 'abc')).toEqual([])
    })

    it('value + more', () => {
      expect(ImmutableArray.remove(['abc', 'def'], 'abc')).toEqual(['def'])
    })

    it('value + more 2', () => {
      expect(ImmutableArray.remove(['abc', 'def', 'ghi'], 'def')).toEqual(['abc', 'ghi'])
    })
  })

  describe('add', () => {

    it('value', () => {
      expect(ImmutableArray.add([], 'abc')).toEqual(['abc'])
    })

    it('value + more', () => {
      expect(ImmutableArray.add(['abc'], 'def')).toEqual(['abc', 'def'])
    })

    it('duplicate', () => {
      expect(ImmutableArray.add(['abc', 'def'], 'def')).toEqual(['abc', 'def'])
    })
  })
})

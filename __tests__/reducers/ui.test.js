import reducer, { defaultState } from '../../app/reducers/ui'
describe('ui reducer', () => {

  it('returns initial state', () => {
    expect(reducer(undefined, {})).toEqual(defaultState)
  })
})

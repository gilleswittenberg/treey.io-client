import reducer, { defaultState } from '../../app/reducers/app'

describe('app reducer', () => {

  it('returns initial state', () => {
    expect(reducer(undefined, {})).toEqual(defaultState)
  })
})

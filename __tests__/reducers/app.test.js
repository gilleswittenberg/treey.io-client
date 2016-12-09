/* @flow */

// @TODO: clean up
declare var describe: any
declare var it: any
declare var expect: any

import reducer, { defaultState } from '../../app/reducers/app'

describe('app reducer', () => {

  it('returns initial state', () => {
    expect(reducer(undefined, {})).toEqual(defaultState)
  })
})

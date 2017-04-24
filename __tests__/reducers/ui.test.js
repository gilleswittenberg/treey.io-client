/* @flow */

// required for Flow type
declare var describe: any
declare var it: any
declare var expect: any

import reducer from '../../app/reducers/ui'
import {
  SET_UI_KEY,
  UNSET_UI_KEY,
  SET_EXPANDED,
  UNSET_EXPANDED
} from '../../app/actions/ui'
import defaultState from '../../app/lib/ui/defaultUI'
import { uid, uid1 } from '../uid'

describe('ui reducer', () => {

  it('SET_UI_KEY', () => {
    expect(reducer(defaultState, { type: SET_UI_KEY, data: { key: 'editing', treePath: [uid] } }).editing).toEqual([uid])
  })

  it('UNSET_UI_KEY', () => {
    const state = { ...defaultState, editing: [uid] }
    expect(reducer(state, { type: UNSET_UI_KEY, data: { key: 'editing' } }).editing).toEqual(null)
  })

  describe('SET_EXPANDED', () => {

    it('SET_EXPANDED', () => {
      const state = reducer(defaultState, { type: SET_EXPANDED, data: { treePath: [uid] } })
      expect(state.expanded).toEqual({ '0': [uid] })
      const state1 = reducer(state, { type: SET_EXPANDED, data: { treePath: [uid, uid1] } })
      expect(state1.expanded[1]).toEqual([uid, uid1])
    })

    it('no duplicates', () => {
      const state = reducer(defaultState, { type: SET_EXPANDED, data: { treePath: [uid] } })
      expect(state.expanded).toEqual({ '0': [uid] })
      const state1 = reducer(state, { type: SET_EXPANDED, data: { treePath: [uid] } })
      expect(state1.expanded).toEqual({ '0': [uid] })
    })
  })

  it('UNSET_EXPANDED', () => {
    const state = { ...defaultState, expanded: { '0': [uid], '1': [uid, uid1] } }
    const state1 = reducer(state, { type: UNSET_EXPANDED, data: { treePath: [uid, uid1] } })
    expect(state1.expanded).toEqual({ '0': [uid] })
  })
})

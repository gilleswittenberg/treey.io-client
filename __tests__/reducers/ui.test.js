/* @flow */

// Required for Flow type
declare var describe: any
declare var it: any
declare var expect: any

import reducer from '../../app/reducers/ui'
import {
  SET_UI_KEY,
  UNSET_UI_KEY,
  SET_EXPANDED,
  UNSET_EXPANDED,
  UNSET_EXPANDED_DEEP
} from '../../app/actions/ui'
import defaultState from '../../app/lib/ui/defaultUI'
import { uuid, uuid1, uuid2, uuid3 } from '../uuid'

describe('ui reducer', () => {

  it('SET_UI_KEY', () => {
    expect(reducer(defaultState, { type: SET_UI_KEY, data: { key: 'editing', treePath: [uuid] } }).editing).toEqual([uuid])
  })

  it('UNSET_UI_KEY', () => {
    const state = { ...defaultState, editing: [uuid] }
    expect(reducer(state, { type: UNSET_UI_KEY, data: { key: 'editing' } }).editing).toEqual(null)
  })

  describe('SET_EXPANDED', () => {

    it('SET_EXPANDED', () => {
      const state = reducer(defaultState, { type: SET_EXPANDED, data: { treePath: [uuid] } })
      expect(state.expanded).toEqual({ '0': [uuid] }) // eslint-disable-line quote-props
      const state1 = reducer(state, { type: SET_EXPANDED, data: { treePath: [uuid, uuid1] } })
      expect(state1.expanded[1]).toEqual([uuid, uuid1])
    })

    it('no duplicates', () => {
      const state = reducer(defaultState, { type: SET_EXPANDED, data: { treePath: [uuid] } })
      expect(state.expanded).toEqual({ '0': [uuid] }) // eslint-disable-line quote-props
      const state1 = reducer(state, { type: SET_EXPANDED, data: { treePath: [uuid] } })
      expect(state1.expanded).toEqual({ '0': [uuid] }) // eslint-disable-line quote-props
    })
  })

  it('UNSET_EXPANDED', () => {
    const state = { ...defaultState, expanded: { '0': [uuid], '1': [uuid, uuid1] } } // eslint-disable-line quote-props
    const state1 = reducer(state, { type: UNSET_EXPANDED, data: { treePath: [uuid, uuid1] } })
    expect(state1.expanded).toEqual({ '0': [uuid] }) // eslint-disable-line quote-props
  })

  it('UNSET_EXPANDED_DEEP', () => {
    const state = {
      ...defaultState,
      expanded: { '0': [uuid], '1': [uuid, uuid1], '3': [uuid, uuid1, uuid2], '4': [uuid, uuid1, uuid3] } // eslint-disable-line quote-props
    }
    const state1 = reducer(state, { type: UNSET_EXPANDED_DEEP, data: { treePath: [uuid, uuid1] } })
    expect(state1.expanded).toEqual({ '0': [uuid] }) // eslint-disable-line quote-props
  })
})

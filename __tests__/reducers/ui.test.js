import reducer from '../../app/reducers/ui'
import {
  INIT,
  SET_IS_EDITING, UNSET_IS_EDITING,
  SET_SHOW_BUTTONS, UNSET_SHOW_BUTTONS,
  EXPAND, COLLAPSE
} from '../../app/actions/ui'
import Storage, { keys } from '../../app/lib/Storage'

const expandedKey = keys[0]

jest.genMockFromModule('../../__mocks__/localStorage')

describe('nodes reducer', () => {

  it('returns initial state', () => {

    expect(
      reducer(undefined, {})
    ).toEqual({
      editing: null,
      showButtons: null,
      expanded: []
    })
  })

  describe('editing', () => {

    it('SET_IS_EDITING, UNSET_IS_EDITING', () => {

      const uid = '57bedc40e81b0620300d769a'

      const state = reducer(undefined, {})

      const state2 = reducer(state, { type: SET_IS_EDITING, data: { uid } })

      expect(
        state2
      ).toEqual({
        editing: uid,
        showButtons: null,
        expanded: []
      })

      const state3 = reducer(state, { type: UNSET_IS_EDITING })

      expect(
        state3
      ).toEqual({
        editing: null,
        showButtons: null,
        expanded: []
      })
    })
  })

  describe('showButtons', () => {

    it('SET_SHOW_BUTTONS, UNSET_SHOW_BUTTONS', () => {

      const uid = '57bedc40e81b0620300d769a'

      const state = reducer(undefined, {})

      const state2 = reducer(state, { type: SET_SHOW_BUTTONS, data: { uid } })

      expect(
        state2
      ).toEqual({
        editing: null,
        showButtons: uid,
        expanded: []
      })

      const state3 = reducer(state, { type: UNSET_SHOW_BUTTONS })

      expect(
        state3
      ).toEqual({
        editing: null,
        showButtons: null,
        expanded: []
      })
    })
  })

  describe('expanded', () => {

    it('INIT', () => {

      const uid = '57bedc40e81b0620300d769b'

      Storage.set(expandedKey, [uid])

      const state = reducer(undefined, {})
      const state2 = reducer(state, { type: INIT })

      expect(state2.expanded).toContain(uid)
    })

    it('EXPAND', () => {

      const uid = '57bedc40e81b0620300d769b'

      const state = reducer(undefined, {})
      const state2 = reducer(state, { type: EXPAND, data: { uid } })

      expect(state2.expanded).toContain(uid)
    })

    it('COLLAPSE', () => {

      const uid = '57bedc40e81b0620300d769b'

      const state = reducer(undefined, {})
      const state2 = reducer(state, { type: EXPAND, data: { uid } })
      const state3 = reducer(state2, { type: COLLAPSE, data: { uid } })

      expect(state3.expanded).not.toContain(uid)
    })

    it('no duplicates', () => {

      const uid = '57bedc40e81b0620300d769b'

      const state = reducer(undefined, {})
      const state2 = reducer(state, { type: EXPAND, data: { uid } })
      const state3 = reducer(state2, { type: EXPAND, data: { uid } })

      expect(state3.expanded).toContain(uid)
      expect(state3.expanded.length).toBe(1)
    })
  })
})

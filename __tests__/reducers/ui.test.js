import reducer from '../../app/reducers/ui'
import {
  INIT_EXPANDED, EXPAND, TOGGLE_EXPANDED,
  SET_IS_EDITING, UNSET_IS_EDITING,
  SET_IS_DRAGGING, UNSET_IS_DRAGGING,
  SET_SHOW_BUTTONS, UNSET_SHOW_BUTTONS
} from '../../app/actions/ui'

describe('nodes reducer', () => {

  it('returns initial state', () => {

    expect(
      reducer(undefined, {})
    ).toEqual({
      lang: 'en',
      dragging: null,
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
        lang: 'en',
        dragging: null,
        editing: uid,
        showButtons: null,
        expanded: []
      })

      const state3 = reducer(state, { type: UNSET_IS_EDITING })

      expect(
        state3
      ).toEqual({
        lang: 'en',
        dragging: null,
        editing: null,
        showButtons: null,
        expanded: []
      })
    })
  })

  describe('dragging', () => {

    it('SET_IS_DRAGGING, UNSET_IS_DRAGGING', () => {

      const uid = '57bedc40e81b0620300d769a'

      const state = reducer(undefined, {})

      const state2 = reducer(state, { type: SET_IS_DRAGGING, data: { uid } })

      expect(
        state2
      ).toEqual({
        lang: 'en',
        dragging: uid,
        editing: null,
        showButtons: null,
        expanded: []
      })

      const state3 = reducer(state, { type: UNSET_IS_DRAGGING })

      expect(
        state3
      ).toEqual({
        lang: 'en',
        dragging: null,
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
        lang: 'en',
        dragging: null,
        editing: null,
        showButtons: uid,
        expanded: []
      })

      const state3 = reducer(state, { type: UNSET_SHOW_BUTTONS })

      expect(
        state3
      ).toEqual({
        lang: 'en',
        dragging: null,
        editing: null,
        showButtons: null,
        expanded: []
      })
    })
  })

  describe('expanded', () => {

    it('INIT_EXPANDED', () => {

      const uid = '57bedc40e81b0620300d769b'
      const state = reducer(undefined, { type: INIT_EXPANDED, data: { expanded : [uid] } })
      expect(state.expanded).toContain(uid)
    })

    it('EXPANDED', () => {

      const uid = '57bedc40e81b0620300d769b'
      const state = reducer(undefined, { type: EXPAND, data: { uid } })
      expect(state.expanded).toContain(uid)
      expect(state.expanded.length).toBe(1)
    })

    describe('TOGGLE_EXPANDED', () => {

      it('expand', () => {

        const uid = '57bedc40e81b0620300d769b'

        const state = reducer({ expanded: [] }, {})
        expect(state.expanded).not.toContain(uid)
        const state2 = reducer(state, { type: TOGGLE_EXPANDED, data: { uid } })
        expect(state2.expanded).toContain(uid)
      })

      it('collapse', () => {

        const uid = '57bedc40e81b0620300d769b'

        const state = reducer({ expanded: [uid] }, {})
        expect(state.expanded).toContain(uid)
        const state2 = reducer(state, { type: TOGGLE_EXPANDED, data: { uid } })
        expect(state2.expanded).not.toContain(uid)
      })
    })
  })
})

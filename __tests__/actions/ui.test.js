import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../../app/actions/ui'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('ui actions', () => {

  describe('isEditing', () => {

    it('setIsEditing', () => {

      const store = mockStore({ ui: null })
      const uid = '57bedc40e81b0620300d769a'

      store.dispatch(actions.setIsEditing(uid))
      const lastAction = store.getActions().pop()
      expect(lastAction.type).toEqual(actions.SET_IS_EDITING)
      expect(lastAction.data.uid).toEqual(uid)
    })

    it('unsetIsEditing', () => {

      const store = mockStore({ ui: null })

      store.dispatch(actions.unsetIsEditing())
      const lastAction = store.getActions().pop()
      expect(lastAction.type).toEqual(actions.UNSET_IS_EDITING)
    })
  })

  describe('isDragging', () => {

    it('setIsDragging', () => {

      const store = mockStore({ ui: null })
      const uid = '57bedc40e81b0620300d769a'

      store.dispatch(actions.setIsDragging(uid))
      const lastAction = store.getActions().pop()
      expect(lastAction.type).toEqual(actions.SET_IS_DRAGGING)
      expect(lastAction.data.uid).toEqual(uid)
    })

    it('unsetIsDragging', () => {

      const store = mockStore({ ui: null })

      store.dispatch(actions.unsetIsDragging())
      const lastAction = store.getActions().pop()
      expect(lastAction.type).toEqual(actions.UNSET_IS_DRAGGING)
    })
  })

  describe('showButtons', () => {

    it('setShowButtons', () => {

      const store = mockStore({ ui: null })
      const uid = '57bedc40e81b0620300d769a'

      store.dispatch(actions.setShowButtons(uid))
      const lastAction = store.getActions().pop()
      expect(lastAction.type).toEqual(actions.SET_SHOW_BUTTONS)
      expect(lastAction.data.uid).toEqual(uid)
    })

    it('unsetShowButtons', () => {

      const store = mockStore({ ui: null })

      store.dispatch(actions.unsetShowButtons())
      const lastAction = store.getActions().pop()
      expect(lastAction.type).toEqual(actions.UNSET_SHOW_BUTTONS)
    })
  })

  describe('expanded', () => {

    const uid = '57bedc40e81b0620300d769a'

    it('initExpanded', () => {

      const store = mockStore({ ui: { expanded: [] } })

      store.dispatch(actions.initExpanded([uid]))
      const lastAction = store.getActions().pop()
      expect(lastAction.type).toEqual(actions.INIT_EXPANDED)
      expect(lastAction.data.expanded).toEqual([uid])
    })

    it('expand', () => {

      const store = mockStore({ ui: { expanded: [] } })

      store.dispatch(actions.expand(uid))
      const lastAction = store.getActions().pop()
      expect(lastAction.type).toEqual(actions.EXPAND)
      expect(lastAction.data.uid).toEqual(uid)
    })

    it('toggleExpanded', () => {

      const store = mockStore({ ui: { expanded: [] } })

      store.dispatch(actions.toggleExpanded(uid))
      const lastAction = store.getActions().pop()
      expect(lastAction.type).toEqual(actions.TOGGLE_EXPANDED)
      expect(lastAction.data.uid).toEqual(uid)
    })
  })
})

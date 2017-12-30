/* @flow */

// Required for Flow type
declare var describe: any
declare var it: any
declare var expect: any

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import multi from 'redux-multi'
import {
  clearUIEditingAdding,
  setUIEditing,
  setUIAdding,
  setUIActive,
  setUIExpanded,
  unsetUIExpanded,
  unsetUIExpandedDeep,
  setUIMovingChild,
  clearUIMovingChild,
  setUIDragging,
  clearUIDragging,
  setUIButtonsShown,
  clearUIButtonsShown,
  initUIRoot
} from '../../app/actions/ui'

import { uuid, uuid1 } from '../uuid'

const middlewares = [thunk, multi]
const mockStore = configureMockStore(middlewares)

describe('actions ui', () => {

  describe('clearUIEditingAdding', () => {

    it('actions', () => {
      const store = mockStore({ tree: null })
      store.dispatch(clearUIEditingAdding())

      const lastAction = store.getActions().pop()
      const secondLastAction = store.getActions().pop()
      expect(lastAction.type).toBe('UNSET_UI_KEY')
      expect(lastAction.data.key).toBe('adding')
      expect(lastAction.type).toBe('UNSET_UI_KEY')
      expect(secondLastAction.data.key).toBe('editing')
    })
  })

  describe('setUIEditing', () => {

    it('actions', () => {
      const store = mockStore({ tree: null })
      store.dispatch(setUIEditing([uuid, uuid1]))

      const lastAction = store.getActions().pop()
      const secondLastAction = store.getActions().pop()
      expect(lastAction.type).toBe('SET_UI_KEY')
      expect(lastAction.data.treePath).toEqual([uuid, uuid1])
      expect(lastAction.data.key).toBe('active')
      expect(secondLastAction.type).toBe('SET_UI_KEY')
      expect(secondLastAction.data.treePath).toEqual([uuid, uuid1])
      expect(secondLastAction.data.key).toBe('editing')
    })
  })

  describe('setUIAdding', () => {

    it('actions', () => {
      const store = mockStore({ tree: null })
      store.dispatch(setUIAdding([uuid, uuid1]))

      const lastAction = store.getActions().pop()
      const secondLastAction = store.getActions().pop()
      expect(lastAction.type).toBe('SET_UI_KEY')
      expect(lastAction.data.treePath).toEqual([uuid, uuid1])
      expect(lastAction.data.key).toBe('active')
      expect(secondLastAction.type).toBe('SET_UI_KEY')
      expect(secondLastAction.data.treePath).toEqual([uuid, uuid1])
      expect(secondLastAction.data.key).toBe('adding')
    })
  })

  describe('setUIActive', () => {

    it('action', () => {
      const store = mockStore({ tree: null })
      store.dispatch(setUIActive([uuid, uuid1]))

      const lastAction = store.getActions().pop()
      expect(lastAction.type).toBe('SET_UI_KEY')
      expect(lastAction.data.treePath).toEqual([uuid, uuid1])
      expect(lastAction.data.key).toBe('active')
    })
  })

  describe('setUIExpanded', () => {

    it('actions', () => {
      const store = mockStore({ tree: null })
      store.dispatch(setUIExpanded([uuid, uuid1]))

      const lastAction = store.getActions().pop()
      expect(lastAction.type).toBe('SET_EXPANDED')
      expect(lastAction.data.treePath).toEqual([uuid, uuid1])
    })
  })

  describe('unsetUIExpanded', () => {

    it('actions', () => {
      const store = mockStore({ tree: null })
      store.dispatch(unsetUIExpanded([uuid, uuid1]))

      const lastAction = store.getActions().pop()
      expect(lastAction.type).toBe('UNSET_EXPANDED')
      expect(lastAction.data.treePath).toEqual([uuid, uuid1])
    })
  })

  describe('unsetUIExpandedDeep', () => {

    it('actions', () => {
      const store = mockStore({ tree: null })
      store.dispatch(unsetUIExpandedDeep([uuid, uuid1]))

      const lastAction = store.getActions().pop()
      expect(lastAction.type).toBe('UNSET_EXPANDED_DEEP')
      expect(lastAction.data.treePath).toEqual([uuid, uuid1])
    })
  })

  describe('setUIMovingChild', () => {

    it('actions', () => {
      const store = mockStore({ tree: null })
      store.dispatch(setUIMovingChild([uuid, uuid1]))

      const lastAction = store.getActions().pop()
      expect(lastAction.type).toBe('SET_UI_KEY')
      expect(lastAction.data.treePath).toEqual([uuid, uuid1])
      expect(lastAction.data.key).toBe('movingChild')
    })
  })

  describe('clearUIMovingChild', () => {

    it('actions', () => {
      const store = mockStore({ tree: null })
      store.dispatch(clearUIMovingChild())

      const lastAction = store.getActions().pop()
      expect(lastAction.type).toBe('UNSET_UI_KEY')
      expect(lastAction.data.key).toBe('movingChild')
    })
  })

  describe('setUIButtonsShown', () => {

    it('action', () => {
      const store = mockStore({ tree: null })
      store.dispatch(setUIButtonsShown([uuid, uuid1]))

      const lastAction = store.getActions().pop()
      expect(lastAction.type).toBe('SET_UI_KEY')
      expect(lastAction.data.treePath).toEqual([uuid, uuid1])
      expect(lastAction.data.key).toBe('buttonsShown')
    })
  })

  describe('clearUIButtonsShown', () => {

    it('actions', () => {
      const store = mockStore({ tree: null })
      store.dispatch(clearUIButtonsShown())

      const lastAction = store.getActions().pop()
      expect(lastAction.type).toBe('UNSET_UI_KEY')
      expect(lastAction.data.key).toBe('buttonsShown')
    })
  })

  describe('setUIDragging', () => {

    it('actions', () => {
      const store = mockStore({ tree: null })
      store.dispatch(setUIDragging([uuid, uuid1]))

      const lastAction = store.getActions().pop()
      expect(lastAction.type).toBe('SET_UI_KEY')
      expect(lastAction.data.treePath).toEqual([uuid, uuid1])
      expect(lastAction.data.key).toBe('dragging')
    })
  })

  describe('clearUIDragging', () => {

    it('actions', () => {
      const store = mockStore({ tree: null })
      store.dispatch(clearUIDragging())

      const lastAction = store.getActions().pop()
      expect(lastAction.type).toBe('UNSET_UI_KEY')
      expect(lastAction.data.key).toBe('dragging')
    })
  })

  describe('initUIRoot', () => {

    it('empty nodes', () => {
      expect(initUIRoot([])).toBeUndefined()
    })

    it('actions', () => {
      const nodes = [{
        uuid,
        data: { title: 'John Doe' },
        nodes: [],
        transactions: []
      }]
      const store = mockStore({ tree: null })
      store.dispatch(initUIRoot(nodes))
      const lastAction = store.getActions().pop()
      const secondLastAction = store.getActions().pop()
      expect(lastAction.type).toBe('SET_UI_KEY')
      expect(secondLastAction.type).toBe('SET_EXPANDED')
      expect(secondLastAction.data.treePath).toEqual([uuid])
    })
  })
})

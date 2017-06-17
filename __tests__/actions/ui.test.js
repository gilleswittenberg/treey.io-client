/* @flow */

// Required for Flow type
declare var describe: any
declare var it: any
declare var expect: any
declare var afterEach: any

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import multi from 'redux-multi'
import nock from 'nock'
import {
  clearUIEditingAdding,
  setUIEditing,
  setUIAdding,
  setUIActive,
  setUIExpanded,
  unsetUIExpanded,
  setUIMovingChild,
  clearUIMovingChild,
  setUIDragging,
  clearUIDragging,
  setUIButtonsShown,
  clearUIButtonsShown
} from '../../app/actions/ui'

import { uid, uid1 } from '../uid'

const middlewares = [thunk, multi]
const mockStore = configureMockStore(middlewares)

describe('ui actions', () => {

  afterEach(() => {
    nock.cleanAll()
  })

  describe('ui', () => {

    describe('clearUIEditingAdding', () => {

      it('action', () => {

        const store = mockStore({ tree: null })

        store.dispatch(clearUIEditingAdding())
        const lastAction = store.getActions().pop()
        const secondLastAction = store.getActions().pop()
        expect(lastAction.type).toEqual('UNSET_UI_KEY')
        expect(lastAction.data.key).toEqual('adding')
        expect(lastAction.type).toEqual('UNSET_UI_KEY')
        expect(secondLastAction.data.key).toEqual('editing')
      })
    })

    describe('setUIEditing', () => {

      it('actions', () => {

        const store = mockStore({ tree: null })

        store.dispatch(setUIEditing([uid, uid1]))
        const lastAction = store.getActions().pop()
        expect(lastAction.type).toEqual('SET_UI_KEY')
        expect(lastAction.data.treePath).toEqual([uid, uid1])
        expect(lastAction.data.key).toBe('editing')
      })
    })

    describe('setUIAdding', () => {

      it('actions', () => {

        const store = mockStore({ tree: null })

        store.dispatch(setUIAdding([uid, uid1]))
        const lastAction = store.getActions().pop()
        expect(lastAction.type).toEqual('SET_UI_KEY')
        expect(lastAction.data.treePath).toEqual([uid, uid1])
        expect(lastAction.data.key).toBe('adding')
      })
    })

    describe('setUIExpanded', () => {

      it('actions', () => {

        const store = mockStore({ tree: null })

        store.dispatch(setUIExpanded([uid, uid1]))
        const lastAction = store.getActions().pop()
        expect(lastAction.type).toEqual('SET_EXPANDED')
        expect(lastAction.data.treePath).toEqual([uid, uid1])
      })
    })

    describe('unsetUIExpanded', () => {

      it('actions', () => {

        const store = mockStore({ tree: null })

        store.dispatch(unsetUIExpanded([uid, uid1]))
        const lastAction = store.getActions().pop()
        expect(lastAction.type).toEqual('UNSET_EXPANDED')
        expect(lastAction.data.treePath).toEqual([uid, uid1])
      })
    })

    describe('clearUIMovingChild', () => {

      it('actions', () => {
        const store = mockStore({ tree: null })
        store.dispatch(clearUIMovingChild())
        const lastAction = store.getActions().pop()
        expect(lastAction.type).toEqual('UNSET_UI_KEY')
        expect(lastAction.data.key).toEqual('movingChild')
      })
    })

    describe('clearUIButtonsShown', () => {

      it('actions', () => {
        const store = mockStore({ tree: null })
        store.dispatch(clearUIButtonsShown())
        const lastAction = store.getActions().pop()
        expect(lastAction.type).toEqual('UNSET_UI_KEY')
        expect(lastAction.data.key).toEqual('buttonsShown')
      })
    })

    describe('clearUIDragging', () => {

      it('actions', () => {
        const store = mockStore({ tree: null })
        store.dispatch(clearUIDragging())
        const lastAction = store.getActions().pop()
        expect(lastAction.type).toEqual('UNSET_UI_KEY')
        expect(lastAction.data.key).toEqual('dragging')
      })
    })

    describe('setUIMovingChild', () => {

      it('actions', () => {

        const store = mockStore({ tree: null })

        store.dispatch(setUIMovingChild([uid, uid1]))
        const lastAction = store.getActions().pop()
        expect(lastAction.type).toEqual('SET_UI_KEY')
        expect(lastAction.data.treePath).toEqual([uid, uid1])
        expect(lastAction.data.key).toBe('movingChild')
      })
    })

    describe('setUIDragging', () => {

      it('actions', () => {

        const store = mockStore({ tree: null })

        store.dispatch(setUIDragging([uid, uid1]))
        const lastAction = store.getActions().pop()
        expect(lastAction.type).toEqual('SET_UI_KEY')
        expect(lastAction.data.treePath).toEqual([uid, uid1])
        expect(lastAction.data.key).toBe('dragging')
      })
    })

    describe('setUIActive', () => {

      it('actions', () => {

        const store = mockStore({ tree: null })

        store.dispatch(setUIActive([uid, uid1]))
        const lastAction = store.getActions().pop()
        expect(lastAction.type).toEqual('SET_UI_KEY')
        expect(lastAction.data.treePath).toEqual([uid, uid1])
        expect(lastAction.data.key).toBe('active')
      })
    })

    describe('setUIButtonsShown', () => {

      it('actions', () => {

        const store = mockStore({ tree: null })

        store.dispatch(setUIButtonsShown([uid, uid1]))
        const lastAction = store.getActions().pop()
        expect(lastAction.type).toEqual('SET_UI_KEY')
        expect(lastAction.data.treePath).toEqual([uid, uid1])
        expect(lastAction.data.key).toBe('buttonsShown')
      })
    })
  })
})

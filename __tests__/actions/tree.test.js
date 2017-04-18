/* @flow */

// required for Flow type
declare var describe: any
declare var it: any
declare var expect: any
declare var afterEach: any

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import multi from 'redux-multi'
import nock from 'nock'
import * as actions from '../../app/actions/tree'

const middlewares = [thunk, multi]
const mockStore = configureMockStore(middlewares)

describe('nodes actions', () => {

  afterEach(() => {
    nock.cleanAll()
  })

  describe('ui', () => {

    describe('clearUIEditingAdding', () => {

      it('action', () => {

        const store = mockStore({ tree: null })

        store.dispatch(actions.clearUIEditingAdding())
        const lastAction = store.getActions().pop()
        expect(lastAction.type).toEqual('CLEAR_NODE_UI')
        expect(lastAction.data).toEqual({ keys: ['editing', 'adding'] })
      })
    })

    describe('setUIEditing', () => {

      it('actions', () => {

        const store = mockStore({ tree: null })

        store.dispatch(actions.setUIEditing([]))
        const lastAction = store.getActions().pop()
        const secondLastAction = store.getActions().pop()
        expect(secondLastAction.type).toEqual('CLEAR_NODE_UI')
        expect(lastAction.type).toEqual('UPDATE_NODE_UI')
        expect(lastAction.data.indexPath).toEqual([])
        expect(lastAction.data.key).toBe('editing')
        expect(lastAction.data.value).toBe(true)
      })
    })

    describe('setUIAdding', () => {

      it('actions', () => {

        const store = mockStore({ tree: null })

        store.dispatch(actions.setUIAdding([]))
        const lastAction = store.getActions().pop()
        const secondLastAction = store.getActions().pop()
        expect(secondLastAction.type).toEqual('CLEAR_NODE_UI')
        expect(secondLastAction.data.keys).toEqual(['editing', 'adding'])
        expect(lastAction.type).toEqual('UPDATE_NODE_UI')
        expect(lastAction.data.indexPath).toEqual([])
        expect(lastAction.data.key).toBe('adding')
        expect(lastAction.data.value).toBe(true)
      })
    })

    describe('setUIExpanded', () => {

      it('actions', () => {

        const store = mockStore({ tree: null })

        store.dispatch(actions.setUIExpanded([]))
        const lastAction = store.getActions().pop()
        expect(lastAction.type).toEqual('UPDATE_NODE_UI')
        expect(lastAction.data.indexPath).toEqual([])
        expect(lastAction.data.key).toBe('expanded')
        expect(lastAction.data.value).toBe(true)
      })
    })

    describe('clearUIMovingChild', () => {

      it('actions', () => {
        const store = mockStore({ tree: null })
        store.dispatch(actions.clearUIMovingChild())
        const lastAction = store.getActions().pop()
        expect(lastAction.type).toEqual('CLEAR_NODE_UI')
        expect(lastAction.data.keys).toEqual(['movingChild'])
      })
    })

    describe('clearUIButtonsShown', () => {

      it('actions', () => {
        const store = mockStore({ tree: null })
        store.dispatch(actions.clearUIButtonsShown())
        const lastAction = store.getActions().pop()
        expect(lastAction.type).toEqual('CLEAR_NODE_UI')
        expect(lastAction.data.keys).toEqual(['buttonsShown'])
      })
    })

    describe('clearUIDragging', () => {

      it('actions', () => {
        const store = mockStore({ tree: null })
        store.dispatch(actions.clearUIDragging())
        const lastAction = store.getActions().pop()
        expect(lastAction.type).toEqual('CLEAR_NODE_UI')
        expect(lastAction.data.keys).toEqual(['dragging'])
      })
    })

    describe('setUIMovingChild', () => {

      it('actions', () => {

        const store = mockStore({ tree: null })

        store.dispatch(actions.setUIMovingChild([]))
        const lastAction = store.getActions().pop()
        const secondLastAction = store.getActions().pop()
        expect(secondLastAction.type).toEqual('CLEAR_NODE_UI')
        expect(secondLastAction.data.keys).toEqual(['movingChild'])
        expect(lastAction.type).toEqual('UPDATE_NODE_UI')
        expect(lastAction.data.indexPath).toEqual([])
        expect(lastAction.data.key).toBe('movingChild')
        expect(lastAction.data.value).toBe(true)
      })
    })

    describe('setUIDragging', () => {

      it('actions', () => {

        const store = mockStore({ tree: null })

        store.dispatch(actions.setUIDragging([]))
        const lastAction = store.getActions().pop()
        const secondLastAction = store.getActions().pop()
        expect(secondLastAction.type).toEqual('CLEAR_NODE_UI')
        expect(secondLastAction.data.keys).toEqual(['dragging'])
        expect(lastAction.type).toEqual('UPDATE_NODE_UI')
        expect(lastAction.data.indexPath).toEqual([])
        expect(lastAction.data.key).toBe('dragging')
        expect(lastAction.data.value).toBe(true)
      })
    })

    describe('setUIActive', () => {

      it('actions', () => {

        const store = mockStore({ tree: null })

        store.dispatch(actions.setUIActive([]))
        const lastAction = store.getActions().pop()
        const secondLastAction = store.getActions().pop()
        expect(secondLastAction.type).toEqual('CLEAR_NODE_UI')
        expect(secondLastAction.data.keys).toEqual(['active'])
        expect(lastAction.type).toEqual('UPDATE_NODE_UI')
        expect(lastAction.data.indexPath).toEqual([])
        expect(lastAction.data.key).toBe('active')
        expect(lastAction.data.value).toBe(true)
      })
    })

    describe('setUIButtonsShown', () => {

      it('actions', () => {

        const store = mockStore({ tree: null })

        store.dispatch(actions.setUIButtonsShown([]))
        const lastAction = store.getActions().pop()
        const secondLastAction = store.getActions().pop()
        expect(secondLastAction.type).toEqual('CLEAR_NODE_UI')
        expect(secondLastAction.data.keys).toEqual(['buttonsShown'])
        expect(lastAction.type).toEqual('UPDATE_NODE_UI')
        expect(lastAction.data.indexPath).toEqual([])
        expect(lastAction.data.key).toBe('buttonsShown')
        expect(lastAction.data.value).toBe(true)
      })
    })

    describe('updateActiveNodeUI', () => {

      it('actions', () => {

        const store = mockStore({ tree: null })

        store.dispatch(actions.updateActiveNodeUI('editing'))
        const lastAction = store.getActions().pop()
        expect(lastAction.type).toEqual('UPDATE_ACTIVE_NODE_UI')
        expect(lastAction.data.key).toBe('editing')
        expect(lastAction.data.value).toBe(true)
      })
    })

    describe('setNextUIActive', () => {

      it('actions', () => {
        const store = mockStore({ tree: null })
        store.dispatch(actions.setNextUIActive())
        const lastAction = store.getActions().pop()
        expect(lastAction.type).toEqual('SET_NEXT_UI_ACTIVE')
      })
    })

    describe('setPrevUIActive', () => {

      it('actions', () => {
        const store = mockStore({ tree: null })
        store.dispatch(actions.setPrevUIActive())
        const lastAction = store.getActions().pop()
        expect(lastAction.type).toEqual('SET_PREV_UI_ACTIVE')
      })
    })
  })
})

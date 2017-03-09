/* @flow */

// required for Flow type
declare var describe: any
declare var it: any
declare var expect: any

import reducer from '../../app/reducers/nodes'
import {
  START_SYNCING,
  STOP_SYNCING,
  HAS_ERRORS,
  INDEX_NODES,
  ADD_NODE,
  UPDATE_NODE,
  ADD_NODE_TRANSACTION,
  UPDATE_NODE_TRANSACTION_STATUS,
  REMOVE_NODE,
  CLEAR_NODE_UI,
  UPDATE_NODE_UI,
  UPDATE_ACTIVE_NODE_UI
} from '../../app/actions/nodes'
import { uid, uid1, uid2, uid3, uid4, uid5, uid6, uid7 } from '../uid'
import defaultUI from '../../app/lib/ui/defaultUI'
import { defaultState } from '../../app/reducers/nodes'
import uuid from 'uuid/v4'

describe('nodes reducer', () => {

  it('SYNCING', () => {
    expect(reducer(undefined, { type: START_SYNCING, data: {} }).isSyncing).toBe(true)
    expect(reducer(undefined, { type: STOP_SYNCING, data: {} }).isSyncing).toBe(false)
  })

  it('HAS_ERRORS', () => {
    expect(reducer(undefined, { type: HAS_ERRORS, data: {} }).hasErrors).toBe(true)
  })

  it('nodes', () => {

    const tree = { nodes: [{
      uid,
      title: 'John Doe',
      nodes: [
        {
          uid: uid1,
          title: 'ToDo',
          nodes: [
            {
              uid: uid2,
              title: 'bring home the milk',
              nodes: []
            },
            {
              uid: uid3,
              title: 'clean the house',
              nodes: []
            }
          ]
        },
        {
          uid: uid4,
          title: 'Movies',
          nodes: [
            {
              uid: uid5,
              title: 'Star Wars: Episode IV - A New Hope (1977)',
              nodes: []
            },
            {
              uid: uid6,
              title: 'The Terminator (1984)',
              nodes: []
            },
            {
              uid: uid7,
              title: 'The Matrix (1999)',
              nodes: []
            }
          ]
        }
      ]
    } ] }

    const state = reducer(undefined, { type: INDEX_NODES, data: { tree } })
    // parsed Tree
    if (state.tree != null) {
      expect(state.tree.nodes[0].path).not.toBe(null)
    }
    if (state.tree != null) {
      expect(state.tree.nodes[0].node.ui).not.toBe(null)
    }
    if (state.tree != null) {
      state.tree.nodes[0].nodes.forEach(function (node) {
        expect(node.path).not.toBe(null)
        expect(node.node.ui).not.toBe(null)
        expect(node.node.transactions).not.toBe(null)
        node.nodes.forEach(node => {
          expect(node.path).not.toBe(null)
          expect(node.node.ui).not.toBe(null)
          expect(node.node.transactions).not.toBe(null)
        })
      })
    }

    const state2 = reducer(state, {
      type: ADD_NODE,
      data: {
        path: [uid],
        nodeData: { title: 'new' }
      }
    })
    if (state2.tree != null) {
      expect(state2.tree.nodes[0].nodes.length).toBe(3)
    }
    if (state2.tree != null) {
      expect(state2.tree.nodes[0].nodes[2].node.data).toEqual({ title: 'new' })
    }

    const state3 = reducer(state2, {
      type: UPDATE_NODE,
      data: {
        path: [uid],
        nodeData: { title: 'John Doe Sr.' }
      }
    })
    if (state3.tree != null) {
      expect(state3.tree.nodes[0].node.data).toEqual({ title: 'John Doe Sr.' })
    }

    const state4 = reducer(state3, {
      type: REMOVE_NODE,
      data: {
        path: [uid, uid1, uid2]
      }
    })
    if (state4.tree != null) {
      expect(state4.tree.nodes[0].nodes[0].nodes.length).toBe(1)
    }
  })

  describe('transaction', () => {

    it('ADD_NODE_TRANSACTION', () => {

      const tree = { nodes: [{
        path: [uid],
        node: {
          uid,
          data: { title: 'John Doe' },
          transactions: [
            { type: 'SET', data: { title: 'John Doe' }, status: 'COMMITTED', uuid: '' }
          ],
          ui: {},
          user: 'user1'
        },
        nodes: []
      }] }
      const state = {
        isSyncing: false,
        hasErrors: false,
        tree,
        userIsDragging: false,
        activePath: null
      }
      const transaction = { type: 'SET', data: { title: 'New' }, status: 'PENDING', uuid: '' }
      const state2 = reducer(state, {
        type: ADD_NODE_TRANSACTION,
        data: {
          path: [uid],
          transaction
        }
      })
      if (state2.tree != null && state2.tree.nodes != null) {
        expect(state2.tree.nodes[0].node.data).toEqual({ title: 'New' })
      }
      if (state2.tree != null && state2.tree.nodes != null) {
        expect(state2.tree.nodes[0].node.transactions[1]).toEqual(transaction)
      }
    })

    it('UPDATE_NODE_TRANSACTION_STATUS', () => {


      const transaction = { type: 'SET', uuid: uuid(), data: { title: 'John Doe' }, status: 'PENDING' }
      const tree = { nodes: [{
        path: [uid],
        node: {
          uid,
          data: { title: 'John Doe' },
          transactions: [transaction],
          ui: {},
          user: 'user1'
        },
        nodes: []
      }] }
      const state = {
        isSyncing: false,
        hasErrors: false,
        tree,
        userIsDragging: false,
        activePath: null
      }
      const state2 = reducer(state, {
        type: UPDATE_NODE_TRANSACTION_STATUS,
        data: {
          path: [uid],
          transaction,
          status: 'COMMITTED'
        }
      })
      if (state2.tree != null && state2.tree.nodes != null) {
        expect(state2.tree.nodes[0].node.transactions[0].status).toEqual('COMMITTED')
      }
    })
  })

  describe('ui', () => {

    it('CLEAR_NODE_UI', () => {
      const tree = { nodes: [
        {
          node: {
            uid,
            user: null,
            data: { title: '' },
            ui: { ...defaultUI, editing: true },
            transactions: []
          },
          path: [uid],
          nodes: []
        }
      ] }
      const state = reducer({ ...defaultState, tree }, { type: CLEAR_NODE_UI, data: { keys: ['editing'] } })
      expect(state.tree).not.toBe(null)
      if (state.tree != null) {
        expect (state.tree.nodes[0].node.ui.editing).toBe(false)
      }
    })

    it('CLEAR_NODE_UI userIsDragging', () => {
      const tree = { nodes: [
        {
          node: {
            uid,
            user: null,
            data: { title: '' },
            ui: { ...defaultUI, dragging: true },
            transactions: []
          },
          path: [uid],
          nodes: []
        }
      ] }
      const state = reducer({ ...defaultState, tree, userIsDragging: true }, { type: CLEAR_NODE_UI, data: { keys: ['dragging'] } })
      expect(state.tree).not.toBe(null)
      if (state.tree != null) {
        expect (state.tree.nodes[0].node.ui.dragging).toBe(false)
      }
      expect (state.userIsDragging).toBe(false)
    })

    it('UPDATE_NODE_UI', () => {
      const tree = { nodes: [
        {
          node: {
            uid,
            user: null,
            data: { title: '' },
            ui: { ...defaultUI },
            transactions: []
          },
          path: [uid],
          nodes: []
        }
      ] }
      const state = reducer({ ...defaultState, tree }, { type: UPDATE_NODE_UI, data: { path: [uid], key: 'editing', value: true } })
      expect(state.tree).not.toBe(null)
      if (state.tree != null) {
        expect (state.tree.nodes[0].node.ui.editing).toBe(true)
      }
    })

    it('UPDATE_NODE_UI dragging', () => {
      const tree = { nodes: [
        {
          node: {
            uid,
            user: null,
            data: { title: '' },
            ui: { ...defaultUI },
            transactions: []
          },
          path: [uid],
          nodes: []
        }
      ] }
      const state = reducer({ ...defaultState, tree }, { type: UPDATE_NODE_UI, data: { path: [uid], key: 'dragging', value: true } })
      expect(state.tree).not.toBe(null)
      if (state.tree != null) {
        expect (state.tree.nodes[0].node.ui.dragging).toBe(true)
      }
      expect (state.userIsDragging).toBe(true)
    })

    it('UPDATE_ACTIVE_NODE_UI', () => {
      const tree = { nodes: [
        {
          node: {
            uid,
            user: null,
            data: { title: '' },
            ui: { ...defaultUI, active: true },
            transactions: []
          },
          path: [uid],
          nodes: []
        }
      ] }
      const activePath = [uid]
      const state = reducer({ ...defaultState, tree, activePath }, { type: UPDATE_ACTIVE_NODE_UI, data: { key: 'editing', value: true } })
      expect(state.tree).not.toBe(null)
      if (state.tree != null) {
        expect (state.tree.nodes[0].node.ui.editing).toBe(true)
      }
    })
  })
})

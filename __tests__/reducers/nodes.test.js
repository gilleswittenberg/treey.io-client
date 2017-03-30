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
  ADD_NODE_TRANSACTION,
  UPDATE_NODE_TRANSACTION_STATUS,
  CLEAR_NODE_UI,
  UPDATE_NODE_UI,
  UPDATE_ACTIVE_NODE_UI
} from '../../app/actions/nodes'
import { uid, uid1, uid2, uid3, uid4, uid5 } from '../uid'
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

  it('INDEX_NODES', () => {

    const nodes = [{
      uid,
      data: { title: 'John Doe' },
      transactions: [],
      ui: {},
      nodes: [uid1, uid2],
      user: ''
    }, {
      uid: uid1,
      data: { title: 'ToDo' },
      transactions: [],
      ui: {},
      nodes: [],
      user: ''
    }, {
      uid: uid2,
      data: { title: 'clean the house' },
      transactions: [],
      ui: {},
      nodes: [uid3, uid4, uid5],
      user: ''
    }, {
      uid: uid3,
      data: { title: 'Star Wars: Episode IV - A New Hope (1977)' },
      transactions: [],
      ui: {},
      nodes: [],
      user: ''
    }, {
      uid: uid4,
      data: { title: 'The Terminator (1984)' },
      transactions: [],
      ui: {},
      nodes: [],
      user: ''
    }, {
      uid: uid5,
      data: { title: 'The Matrix (1999)' },
      transactions: [],
      ui: {},
      nodes: [],
      user: ''
    }]

    const state = reducer(undefined, { type: INDEX_NODES, data: { nodes } })
    expect(state.nodes).toBe(nodes)
  })

  describe('transaction', () => {

    describe('ADD_NODE_TRANSACTION', () => {

      it('SET', () => {

        const nodes = [
          {
            uid,
            data: { title: 'John Doe' },
            transactions: [
              { type: 'SET', uid, data: { title: 'John Doe' }, status: 'COMMITTED', uuid: '' }
            ],
            ui: {},
            user: 'user1'
          }
        ]

        const state = {
          isSyncing: false,
          hasErrors: false,
          tree: null,
          nodes,
          userIsDragging: false,
          activePath: null
        }
        const transaction = { type: 'SET', uid, data: { title: 'New' }, status: 'PENDING', uuid: '' }
        const state2 = reducer(state, {
          type: ADD_NODE_TRANSACTION,
          data: {
            transaction
          }
        })
        expect(state2.nodes[0].data).toEqual({ title: 'New' })
        expect(state2.nodes[0].transactions[1]).toEqual(transaction)
      })

      it('REMOVE_CHILD', () => {

        const nodes = [
          {
            uid,
            data: { title: 'John Doe' },
            transactions: [
              { type: 'SET', uid, data: { title: 'John Doe' }, status: 'COMMITTED', uuid: '' }
            ],
            ui: {},
            user: 'user1',
            nodes: [uid1]
          }
        ]
        const state = {
          isSyncing: false,
          hasErrors: false,
          tree: null,
          nodes,
          userIsDragging: false,
          activePath: null
        }
        const transaction = { type: 'REMOVE_CHILD', uid, childUid: uid1, status: 'PENDING', uuid: '' }
        const state2 = reducer(state, {
          type: ADD_NODE_TRANSACTION,
          data: {
            transaction
          }
        })
        // @TODO: remove null check
        if (state2.nodes[0].nodes != null) {
          expect(state2.nodes[0].nodes.length).toBe(0)
        }
        expect(state2.nodes[0].transactions[1]).toEqual(transaction)
      })

      describe('ADD_CHILD', () => {

        it('push', () => {

          const nodes = [
            {
              uid,
              data: { title: 'John Doe' },
              transactions: [
                { type: 'SET', uid, data: { title: 'John Doe' }, status: 'COMMITTED', uuid: '' }
              ],
              ui: {},
              user: 'user1',
              nodes: []
            }
          ]
          const state = {
            isSyncing: false,
            hasErrors: false,
            tree: null,
            nodes,
            userIsDragging: false,
            activePath: null
          }
          const transaction = { type: 'ADD_CHILD', uid, childUid: uid1, status: 'PENDING', uuid: '' }
          const state2 = reducer(state, {
            type: ADD_NODE_TRANSACTION,
            data: {
              transaction
            }
          })
          expect(state2.nodes[0].transactions[1]).toEqual(transaction)
          expect(state2.nodes[0].nodes).toEqual([uid1])
        })

        it('before', () => {

          const nodes = [
            {
              uid,
              data: { title: 'John Doe' },
              transactions: [
                { type: 'SET', uid, data: { title: 'John Doe' }, status: 'COMMITTED', uuid: '' }
              ],
              ui: {},
              user: 'user1',
              nodes: [uid1]
            }
          ]
          const state = {
            isSyncing: false,
            hasErrors: false,
            tree: null,
            nodes,
            userIsDragging: false,
            activePath: null
          }
          const transaction = { type: 'ADD_CHILD', uid, childUid: uid2, before: uid1, status: 'PENDING', uuid: '' }
          const state2 = reducer(state, {
            type: ADD_NODE_TRANSACTION,
            data: {
              transaction
            }
          })
          expect(state2.nodes[0].transactions[1]).toEqual(transaction)
          expect(state2.nodes[0].nodes).toEqual([uid2, uid1])
        })
      })
    })

    describe('UPDATE_NODE_TRANSACTION_STATUS', () => {

      it('SET', () => {
        const transaction = { type: 'SET', uid, uuid: uuid(), data: { title: 'John Doe' }, status: 'PENDING' }
        const nodes = [
          {
            uid,
            data: { title: 'John Doe' },
            transactions: [transaction],
            ui: {},
            user: 'user1',
            nodes: [uid1]
          }
        ]
        const state = {
          isSyncing: false,
          hasErrors: false,
          tree: null,
          nodes,
          userIsDragging: false,
          activePath: null
        }

        const state2 = reducer(state, {
          type: UPDATE_NODE_TRANSACTION_STATUS,
          data: {
            transaction,
            status: 'COMMITTED'
          }
        })
        expect(state2.nodes[0].transactions[0].status).toEqual('COMMITTED')
      })
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

/* @flow */

// Required for Flow type
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
  UPDATE_NODE_TRANSACTION_STATUS
} from '../../app/actions/nodes'
import { uuid, uuid1, uuid2, uuid3, uuid4, uuid5 } from '../uuid'
import uuidv4 from 'uuid/v4'

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
      uuid,
      data: { title: 'John Doe' },
      transactions: [],
      ui: {},
      nodes: [uuid1, uuid2],
      user: ''
    }, {
      uuid: uuid1,
      data: { title: 'ToDo' },
      transactions: [],
      ui: {},
      nodes: [],
      user: ''
    }, {
      uuid: uuid2,
      data: { title: 'clean the house' },
      transactions: [],
      ui: {},
      nodes: [uuid3, uuid4, uuid5],
      user: ''
    }, {
      uuid: uuid3,
      data: { title: 'Star Wars: Episode IV - A New Hope (1977)' },
      transactions: [],
      ui: {},
      nodes: [],
      user: ''
    }, {
      uuid: uuid4,
      data: { title: 'The Terminator (1984)' },
      transactions: [],
      ui: {},
      nodes: [],
      user: ''
    }, {
      uuid: uuid5,
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

      it('CREATE', () => {

        const state = {
          isSyncing: false,
          hasErrors: false,
          nodes: []
        }
        const transaction = { uuid, node: uuid1, type: 'CREATE', status: 'PENDING' }
        const state2 = reducer(state, {
          type: ADD_NODE_TRANSACTION,
          data: {
            transaction
          }
        })
        expect(state2.nodes[0].uuid).toBe(uuid1)
        expect(state2.nodes[0].transactions[0]).toEqual(transaction)
      })

      it('SET', () => {

        const nodes = [
          {
            uuid,
            data: { title: 'John Doe' },
            transactions: [
              { uuid, type: 'SET', node: uuid, data: { title: 'John Doe' }, status: 'COMMITTED' }
            ],
            ui: {},
            user: 'user1'
          }
        ]

        const state = {
          isSyncing: false,
          hasErrors: false,
          nodes
        }
        const transaction = { uuid, type: 'SET', node: uuid, data: { title: 'New' }, status: 'PENDING' }
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
            uuid,
            data: { title: 'John Doe' },
            transactions: [
              { uuid, node: uuid, type: 'SET', data: { title: 'John Doe' }, status: 'COMMITTED' }
            ],
            ui: {},
            user: 'user1',
            nodes: [uuid1]
          }
        ]
        const state = {
          isSyncing: false,
          hasErrors: false,
          nodes
        }
        const transaction = { uuid, type: 'REMOVE_CHILD', node: uuid, child: uuid1, status: 'PENDING' }
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
              uuid,
              data: { title: 'John Doe' },
              transactions: [
                { uuid, node: uuid, type: 'SET', data: { title: 'John Doe' }, status: 'COMMITTED' }
              ],
              ui: {},
              user: 'user1',
              nodes: []
            }
          ]
          const state = {
            isSyncing: false,
            hasErrors: false,
            nodes
          }
          const transaction = { uuid, type: 'ADD_CHILD', node: uuid, child: uuid1, status: 'PENDING' }
          const state2 = reducer(state, {
            type: ADD_NODE_TRANSACTION,
            data: {
              transaction
            }
          })
          expect(state2.nodes[0].transactions[1]).toEqual(transaction)
          expect(state2.nodes[0].nodes).toEqual([uuid1])
        })

        it('before', () => {

          const nodes = [
            {
              uuid,
              data: { title: 'John Doe' },
              transactions: [
                { uuid, node: uuid, type: 'SET', data: { title: 'John Doe' }, status: 'COMMITTED' }
              ],
              ui: {},
              user: 'user1',
              nodes: [uuid1]
            }
          ]
          const state = {
            isSyncing: false,
            hasErrors: false,
            nodes
          }
          const transaction = { uuid, type: 'ADD_CHILD', node: uuid, child: uuid2, before: uuid1, status: 'PENDING' }
          const state2 = reducer(state, {
            type: ADD_NODE_TRANSACTION,
            data: {
              transaction
            }
          })
          expect(state2.nodes[0].transactions[1]).toEqual(transaction)
          expect(state2.nodes[0].nodes).toEqual([uuid2, uuid1])
        })
      })
    })

    describe('UPDATE_NODE_TRANSACTION_STATUS', () => {

      it('SET', () => {
        const transaction = { uuid: uuidv4(), node: uuid, type: 'SET', data: { title: 'John Doe' }, status: 'PENDING' }
        const nodes = [
          {
            uuid,
            data: { title: 'John Doe' },
            transactions: [transaction],
            ui: {},
            user: 'user1',
            nodes: [uuid1]
          }
        ]
        const state = {
          isSyncing: false,
          hasErrors: false,
          nodes
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
})

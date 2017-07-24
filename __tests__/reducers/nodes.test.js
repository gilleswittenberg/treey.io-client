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
  UPDATE_NODE_TRANSACTION_STATUS,
  SET_NODE_TRANSACTION_IS_SYNCING
} from '../../app/actions/nodes'
import { uuid, uuid1, uuid2, uuid3, uuid4, uuid5 } from '../uuid'
import date from '../date'
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
      nodes: [uuid1, uuid2],
      user: ''
    }, {
      uuid: uuid1,
      data: { title: 'ToDo' },
      transactions: [],
      nodes: [],
      user: ''
    }, {
      uuid: uuid2,
      data: { title: 'clean the house' },
      transactions: [],
      nodes: [uuid3, uuid4, uuid5],
      user: ''
    }, {
      uuid: uuid3,
      data: { title: 'Star Wars: Episode IV - A New Hope (1977)' },
      transactions: [],
      nodes: [],
      user: ''
    }, {
      uuid: uuid4,
      data: { title: 'The Terminator (1984)' },
      transactions: [],
      nodes: [],
      user: ''
    }, {
      uuid: uuid5,
      data: { title: 'The Matrix (1999)' },
      transactions: [],
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
        const transaction = {
          uuid,
          node: uuid1,
          type: 'CREATE',
          status: 'PENDING',
          modified: date,
          created: date
        }
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
            transactions: [{
              uuid,
              type: 'SET',
              node: uuid,
              data: { title: 'John Doe' },
              status: 'COMMITTED',
              modified: date,
              created: date
            }],
            user: 'user1'
          }
        ]

        const state = {
          isSyncing: false,
          hasErrors: false,
          nodes
        }
        const transaction = {
          uuid,
          node: uuid,
          type: 'SET',
          status: 'PENDING',
          data: { title: 'New' },
          modified: date,
          created: date
        }
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
            transactions: [{
              uuid,
              node: uuid,
              type: 'SET',
              status: 'COMMITTED',
              data: { title: 'John Doe' },
              modified: date,
              created: date
            }],
            user: 'user1',
            nodes: [uuid1]
          }
        ]
        const state = {
          isSyncing: false,
          hasErrors: false,
          nodes
        }
        const transaction = {
          uuid,
          type: 'REMOVE_CHILD',
          node: uuid,
          child: uuid1,
          status: 'PENDING',
          modified: date,
          created: date
        }
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
              transactions: [{
                uuid,
                node: uuid,
                type: 'SET',
                status: 'COMMITTED',
                data: { title: 'John Doe' },
                modified: date,
                created: date
              }],
              user: 'user1',
              nodes: []
            }
          ]
          const state = {
            isSyncing: false,
            hasErrors: false,
            nodes
          }
          const transaction = {
            uuid,
            type: 'ADD_CHILD',
            node: uuid,
            child: uuid1,
            status: 'PENDING',
            modified: date,
            created: date
          }
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
                {
                  uuid,
                  node: uuid,
                  type: 'SET',
                  status: 'COMMITTED',
                  data: { title: 'John Doe' },
                  modified: date,
                  created: date
                },
                {
                  uuid: uuid1,
                  node: uuid,
                  type: 'ADD_CHILD',
                  status: 'COMMITTED',
                  child: uuid1,
                  modified: date,
                  created: date
                }
              ],
              user: 'user1',
              nodes: [uuid1]
            }
          ]
          const state = {
            isSyncing: false,
            hasErrors: false,
            nodes
          }
          const transaction = {
            uuid: uuid2,
            type: 'ADD_CHILD',
            status: 'PENDING',
            node: uuid,
            child: uuid2,
            before: uuid1,
            modified: date,
            created: date
          }
          const state2 = reducer(state, {
            type: ADD_NODE_TRANSACTION,
            data: {
              transaction
            }
          })
          expect(state2.nodes[0].transactions[2]).toEqual(transaction)
          expect(state2.nodes[0].nodes).toEqual([uuid2, uuid1])
        })
      })

      describe('REVERT', () => {

        it('SET', () => {

          const nodes = [
            {
              uuid,
              data: { title: 'John Doe to be reverted' },
              transactions: [
                {
                  uuid,
                  type: 'SET',
                  node: uuid,
                  data: { title: 'John Doe' },
                  status: 'COMMITTED',
                  modified: date,
                  created: date
                },
                {
                  uuid: uuid1,
                  type: 'SET',
                  node: uuid,
                  data: { title: 'John Doe to be reverted' },
                  status: 'COMMITTED',
                  modified: date,
                  created: date
                }
              ]
            }
          ]

          const state = {
            isSyncing: false,
            hasErrors: false,
            nodes
          }
          const transaction = {
            uuid,
            node: uuid,
            type: 'REVERT',
            status: 'PENDING',
            transaction: uuid1,
            modified: date,
            created: date
          }
          const state2 = reducer(state, {
            type: ADD_NODE_TRANSACTION,
            data: {
              transaction
            }
          })
          expect(state2.nodes[0].data).toEqual({ title: 'John Doe' })
          expect(state2.nodes[0].transactions[2]).toEqual(transaction)
        })
      })
    })

    describe('UPDATE_NODE_TRANSACTION_STATUS', () => {

      describe('COMMITTED', () => {

        it('CREATE', () => {
          const transaction = {
            uuid: uuidv4(),
            node: uuid,
            type: 'CREATE',
            status: 'PENDING',
            auth: { user: 'johndoe' },
            modified: date,
            created: date
          }
          const nodes = [
            {
              uuid,
              data: { title: 'John Doe' },
              transactions: [transaction],
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
          expect(state2.nodes[0].auth).toEqual({ user: 'johndoe' })
        })

        it('SET', () => {
          const transaction = {
            uuid: uuidv4(),
            node: uuid,
            type: 'SET',
            status: 'PENDING',
            data: { title: 'John Doe' },
            modified: date,
            created: date
          }
          const nodes = [
            {
              uuid,
              data: { title: 'John Doe' },
              transactions: [transaction],
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

        it('REVERT', () => {
          const transaction = {
            uuid,
            node: uuid,
            type: 'SET',
            status: 'COMMITTED',
            data: { title: 'John Doe' },
            modified: date,
            created: date
          }
          const transaction1 = {
            uuid: uuid1,
            node: uuid,
            type: 'SET',
            status: 'COMMITTED',
            data: { title: 'John Doe 2' },
            modified: date,
            created: date
          }
          const transaction2 = {
            uuid: uuid2,
            node: uuid,
            type: 'REVERT',
            status: 'PENDING',
            transaction: uuid1,
            modified: date,
            created: date
          }
          const nodes = [
            {
              uuid,
              data: { title: 'John Doe' },
              transactions: [transaction, transaction1, transaction2]
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
              transaction: transaction2,
              status: 'COMMITTED'
            }
          })
          expect(state2.nodes[0].transactions[2].status).toEqual('COMMITTED')
        })
      })

      describe('DENIED', () => {

        it('CREATE', () => {
          const transaction = {
            uuid: uuidv4(),
            node: uuid,
            type: 'CREATE',
            status: 'PENDING',
            auth: { user: 'johndoe' },
            modified: date,
            created: date
          }
          const nodes = [
            {
              uuid,
              data: { title: 'John Doe' },
              transactions: [transaction],
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
              status: 'DENIED'
            }
          })
          expect(state2.nodes.length).toBe(0)
        })

        it('SET', () => {
          const transaction0 = {
            uuid: uuidv4(),
            node: uuid,
            type: 'SET',
            status: 'COMMITTED',
            data: { title: 'John Doe' },
            modified: date,
            created: date
          }
          const transaction1 = {
            uuid: uuidv4(),
            node: uuid,
            type: 'SET',
            status: 'PENDING',
            data: { title: 'John Doe denied' },
            modified: date,
            created: date
          }
          const nodes = [
            {
              uuid,
              data: { title: 'Denied' },
              transactions: [transaction0, transaction1],
              auth: { user: 'user1' },
              nodes: []
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
              transaction: transaction1,
              status: 'DENIED'
            }
          })
          expect(state2.nodes[0].transactions[1].status).toEqual('DENIED')
          expect(state2.nodes[0].data.title).toEqual('John Doe')
        })

        it('ADD_CHILD', () => {
          const transaction = {
            uuid: uuidv4(),
            node: uuid,
            type: 'ADD_CHILD',
            status: 'COMMITTED',
            child: uuid1,
            modified: date,
            created: date
          }
          const nodes = [
            {
              uuid,
              data: { title: 'John Doe' },
              transactions: [transaction],
              auth: { user: 'user1' },
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
              status: 'DENIED'
            }
          })
          expect(state2.nodes[0].transactions[0].status).toBe('DENIED')
          const children = state2.nodes[0].nodes
          expect(children).not.toBe(null)
          if (children != null) {
            expect(children.length).toBe(0)
          }
        })
      })

      describe('CANCELLED', () => {

        it('SET', () => {
          const transaction0 = {
            uuid: uuidv4(),
            node: uuid,
            type: 'SET',
            status: 'COMMITTED',
            data: { title: 'John Doe' },
            modified: date,
            created: date
          }
          const transaction1 = {
            uuid: uuidv4(),
            node: uuid,
            type: 'SET',
            status: 'PENDING',
            data: { title: 'John Doe denied' },
            isSyncing: false,
            modified: date,
            created: date
          }
          const nodes = [
            {
              uuid,
              data: { title: 'John Doe denied' },
              transactions: [transaction0, transaction1],
              auth: { user: 'user1' },
              nodes: []
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
              transaction: transaction1,
              status: 'CANCELLED'
            }
          })
          expect(state2.nodes[0].transactions[1].status).toEqual('CANCELLED')
          expect(state2.nodes[0].data.title).toEqual('John Doe')
        })
      })

      describe('REVERT', () => {

        it('SET', () => {

          const transaction = {
            uuid,
            type: 'SET',
            node: uuid,
            data: { title: 'John Doe' },
            status: 'COMMITTED',
            modified: date,
            created: date
          }
          const transaction1 = {
            uuid: uuid1,
            type: 'SET',
            node: uuid,
            data: { title: 'John Doe to be reverted' },
            status: 'COMMITTED',
            modified: date,
            created: date
          }
          const transaction2 = {
            uuid: uuid2,
            node: uuid,
            type: 'REVERT',
            status: 'PENDING',
            transaction: uuid1,
            modified: date,
            created: date
          }

          const nodes = [
            {
              uuid,
              data: { title: 'John Doe to be reverted' },
              transactions: [
                transaction,
                transaction1,
                transaction2
              ]
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
              transaction: transaction2,
              status: 'DENIED'
            }
          })
          expect(state2.nodes[0].data).toEqual({ title: 'John Doe to be reverted' })
          expect(state2.nodes[0].transactions[2].status).toEqual('DENIED')
        })

        it('ADD_CHILD', () => {

          const transaction = {
            uuid,
            type: 'ADD_CHILD',
            node: uuid,
            child: uuid1,
            status: 'COMMITTED',
            modified: date,
            created: date
          }
          const transaction1 = {
            uuid: uuid1,
            type: 'ADD_CHILD',
            node: uuid,
            child: uuid2,
            status: 'COMMITTED',
            modified: date,
            created: date
          }
          const transaction2 = {
            uuid: uuid2,
            node: uuid,
            type: 'REVERT',
            status: 'PENDING',
            transaction: uuid1,
            modified: date,
            created: date
          }

          const nodes = [
            {
              uuid,
              data: { title: 'John Doe' },
              transactions: [
                transaction,
                transaction1,
                transaction2
              ],
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
              transaction: transaction2,
              status: 'DENIED'
            }
          })
          expect(state2.nodes[0].transactions[2].status).toEqual('DENIED')
          expect(state2.nodes[0].nodes).toEqual([uuid1, uuid2])
        })
      })
    })
  })

  describe('SET_NODE_TRANSACTION_IS_SYNCING', () => {

    it('CREATE', () => {
      const transaction = {
        uuid: uuidv4(),
        node: uuid,
        type: 'CREATE',
        status: 'PENDING',
        auth: { user: 'johndoe' },
        modified: date,
        created: date
      }
      const nodes = [
        {
          uuid,
          data: { title: 'John Doe' },
          transactions: [transaction],
          nodes: [uuid1]
        }
      ]
      const state = {
        isSyncing: false,
        hasErrors: false,
        nodes
      }

      const state2 = reducer(state, {
        type: SET_NODE_TRANSACTION_IS_SYNCING,
        data: {
          transaction,
          isSyncing: true
        }
      })
      expect(state2.nodes[0].transactions[0].isSyncing).toBe(true)
    })
  })
})

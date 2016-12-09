/* @flow */

// @TODO: clean up
declare var describe: any
declare var it: any
declare var expect: any

import reducer from '../../app/reducers/nodes'
import { START_SYNCING, STOP_SYNCING, HAS_ERRORS, INDEX_NODES, ADD_NODE, UPDATE_NODE, REMOVE_NODE } from '../../app/actions/nodes'
import { uid, uid1, uid2, uid3, uid4, uid5, uid6, uid7 } from '../uid'

describe('nodes reducer', () => {

  it('SYNCING', () => {
    expect(reducer(undefined, { type: START_SYNCING, data: {} }).isSyncing).toBe(true)
    expect(reducer(undefined, { type: STOP_SYNCING, data: {} }).isSyncing).toBe(false)
  })

  it('HAS_ERRORS', () => {
    expect(reducer(undefined, { type: HAS_ERRORS, data: {} }).hasErrors).toBe(true)
  })

  it('NODES', () => {

    const tree = {
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
    }

    const state = reducer(undefined, { type: INDEX_NODES, data: { tree } })
    // parsed Tree
    if (state.tree != null) {
      expect(state.tree.nodes[0].path).not.toBe(null)
    }
    if (state.tree != null) {
      expect(state.tree.nodes[0].ui).not.toBe(null)
    }
    if (state.tree != null) {
      state.tree.nodes[0].nodes.forEach(function (node) {
        expect(node.path).not.toBe(null)
        expect(node.ui).not.toBe(null)
        node.nodes.forEach(node => {
          expect(node.path).not.toBe(null)
          expect(node.ui).not.toBe(null)
        })
      })
    }

    const state2 = reducer(state, {
      type: ADD_NODE,
      data: {
        path: [uid],
        node: {
          // @TODO: remove
          uid: null,
          data: { title: 'new' },
          nodes: []
        }
      }
    })
    // @TODO: remove
    if (state2.tree != null) {
      expect(state2.tree.nodes[0].nodes.length).toBe(3)
    }
    // @TODO: remove
    if (state2.tree != null) {
      expect(state2.tree.nodes[0].nodes[2].data).toEqual({ title: 'new' })
    }

    const state3 = reducer(state2, {
      type: UPDATE_NODE,
      data: {
        path: [uid],
        node: {
          // @TODO: remove
          uid: null,
          data: { title: 'John Doe Sr.' },
          nodes: []
        }
      }
    })
    if (state3.tree != null) {
      expect(state3.tree.nodes[0].data).toEqual({ title: 'John Doe Sr.' })
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
})

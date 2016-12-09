/* @flow */

// @TODO: clean up
declare var describe: any
declare var it: any
declare var expect: any

import reducer from '../../app/reducers/nodes'
import { START_SYNCING, STOP_SYNCING, HAS_ERRORS, INDEX_NODES, ADD_NODE, UPDATE_NODE, REMOVE_NODE } from '../../app/actions/nodes'

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
      uid: '57bedc40e81b0620300d769a',
      title: 'John Doe',
      nodes: [
        {
          uid: '57bedc40e81b0620300d769b',
          title: 'ToDo',
          nodes: [
            {
              uid: '57ebc46eb0bf9b00106a3c5e',
              title: 'bring home the milk',
              nodes: []
            },
            {
              uid: '57ebc46eb0bf9b00106a3c5f',
              title: 'clean the house',
              nodes: []
            }
          ]
        },
        {
          uid: '57bedc40e81b0620300d769c',
          title: 'Movies',
          nodes: [
            {
              uid: '57ebc46eb0bf9b00106a3c60',
              title: 'Star Wars: Episode IV - A New Hope (1977)',
              nodes: []
            },
            {
              uid: '57ebc46eb0bf9b00106a3c62',
              title: 'The Terminator (1984)',
              nodes: []
            },
            {
              uid: '57ebc46eb0bf9b00106a3c61',
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
        path: ['57bedc40e81b0620300d769a'],
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
        path: ['57bedc40e81b0620300d769a'],
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
        path: ['57bedc40e81b0620300d769a', '57bedc40e81b0620300d769b', '57ebc46eb0bf9b00106a3c5e']
      }
    })
    if (state4.tree != null) {
      expect(state4.tree.nodes[0].nodes[0].nodes.length).toBe(1)
    }
  })
})

import reducer, { defaultState } from '../../app/reducers/nodes'
import { START_SYNCING, STOP_SYNCING, HAS_ERRORS, INDEX_NODES, ADD_NODE, UPDATE_NODE, REMOVE_NODE } from '../../app/actions/nodes'

describe('nodes reducer', () => {

  it('returns initial state', () => {
    expect(reducer(undefined, {})).toEqual(defaultState)
  })

  it('SYNCING', () => {
    const state = reducer(undefined, {})
    expect(reducer(state, { type: START_SYNCING }).isSyncing).toBe(true)
    expect(reducer(state, { type: STOP_SYNCING }).isSyncing).toBe(false)
  })

  it('HAS_ERRORS', () => {
    const state = reducer(undefined, {})
    expect(reducer(state, { type: HAS_ERRORS }).hasErrors).toBe(true)
  })

  it('NODES', () => {

    const state = reducer(undefined, {})
    const tree = {
      uid: '57bedc40e81b0620300d769a',
      title: 'John Doe',
      nodes: [
        {
          uid: '57bedc40e81b0620300d769b',
          title: 'ToDo',
          nodes: [
            { uid: '57ebc46eb0bf9b00106a3c5e', title: 'bring home the milk' },
            { uid: '57ebc46eb0bf9b00106a3c5f', title: 'clean the house' }
          ]
        },
        {
          uid: '57bedc40e81b0620300d769c',
          title: 'Movies',
          nodes: [
            { uid: '57ebc46eb0bf9b00106a3c60', title: 'Star Wars: Episode IV - A New Hope (1977)' },
            { uid: '57ebc46eb0bf9b00106a3c62', title: 'The Terminator (1984)' },
            { uid: '57ebc46eb0bf9b00106a3c61', title: 'The Matrix (1999)' }
          ]
        }
      ]
    }
    
    const state2 = reducer(state, { type: INDEX_NODES, data: { tree } })
    // parsed Tree
    expect(state2.tree.nodes[0].path).not.toBe(null)
    expect(state2.tree.nodes[0].ui).not.toBe(null)
    state2.tree.nodes[0].nodes.forEach(function (node) {
      expect(node.path).not.toBe(null)
      expect(node.ui).not.toBe(null)
      node.nodes.forEach(node => {
        expect(node.path).not.toBe(null)
        expect(node.ui).not.toBe(null)
      })
    })

    const state3 = reducer(state2, {
      type: ADD_NODE,
      data: {
        path: ['57bedc40e81b0620300d769a'],
        node: {
          data: { title: 'new' }
        }
      }
    })
    expect(state3.tree.nodes[0].nodes.length).toBe(3)
    expect(state3.tree.nodes[0].nodes[2].data.title).toBe('new')

    const state4 = reducer(state3, {
      type: UPDATE_NODE,
      data: {
        path: ['57bedc40e81b0620300d769a'],
        node: {
          data: { title: 'John Doe Sr.' }
        }
      }
    })
    expect(state4.tree.nodes[0].data.title).toBe('John Doe Sr.')

    const state5 = reducer(state4, {
      type: REMOVE_NODE,
      data: {
        path: ['57bedc40e81b0620300d769a', '57bedc40e81b0620300d769b', '57ebc46eb0bf9b00106a3c5e']
      }
    })
    expect(state5.tree.nodes[0].nodes[0].nodes.length).toBe(1)
  })
})

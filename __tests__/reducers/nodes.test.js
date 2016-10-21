import reducer from '../../app/reducers/nodes'
import { START_SYNCING, STOP_SYNCING, HAS_ERRORS, INDEX_NODES, ADD_NODE, UPDATE_NODE, REMOVE_NODE } from '../../app/actions/nodes'

describe('nodes reducer', () => {

  it('returns initial state', () => {

    expect(
      reducer(undefined, {})
    ).toEqual({
      isSyncing: false,
      hasErrors: false,
      tree: null
    })
  })

  it('SYNCING', () => {

    const state = reducer(undefined, {})

    expect(
      reducer(state, { type: START_SYNCING })
    ).toEqual({
      isSyncing: true,
      hasErrors: false,
      tree: null
    })

    expect(
      reducer(state, { type: STOP_SYNCING })
    ).toEqual({
      isSyncing: false,
      hasErrors: false,
      tree: null
    })
  })

  it('HAS_ERRORS', () => {

    const state = reducer(undefined, {})

    expect(
      reducer(state, { type: HAS_ERRORS })
    ).toEqual({
      isSyncing: false,
      hasErrors: true,
      tree: null
    })
  })

  it('NODES', () => {

    const state = reducer(undefined, {})
    const tree = {
      uid: '57bedc40e81b0620300d769a',
      title: 'John Doe',
      nodes: [
        {
          title: 'ToDo',
          nodes: [
            { uid: '57ebc46eb0bf9b00106a3c5e', title: 'bring home the milk' },
            { uid: '57ebc46eb0bf9b00106a3c5f', title: 'clean the house' }
          ]
        },
        {
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
    expect(state2).toEqual({
      isSyncing: false,
      hasErrors: false,
      tree
    })

    const state3 = reducer(state2, { type: ADD_NODE, data: {
      parent: '57bedc40e81b0620300d769a',
      node: { uid: '57bedc40e81b0620300d7690', title: 'new'} }
    })
    expect(state3.tree.nodes.length).toBe(3)
    expect(state3.tree.nodes[2].title).toBe('new')

    const state4 = reducer(state3, { type: UPDATE_NODE, data: { uid: '57bedc40e81b0620300d769a', node: { title: 'John Doe Sr.' } } })
    expect(state4.tree.title).toBe('John Doe Sr.')

    const state5 = reducer(state4, { type: REMOVE_NODE, data: {
      parent: '57bedc40e81b0620300d769a', uid: '57bedc40e81b0620300d7690' }
    })
    expect(state5.tree.nodes.length).toBe(2)
  })
})

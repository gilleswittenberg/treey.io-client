import * as types from '../actions/nodes'
import Tree from '../lib/Tree'

const defaultState = { tree: {} }

export default function nodes (state = defaultState, action) {
  let tree
  switch (action.type) {
  case types.INDEX_NODES:
    return Object.assign({}, state, action.data)
  case types.ADD_NODE:
    tree = Tree.create(state.tree, action.data.parent, action.data.node)
    return Object.assign({}, state, { tree })
  case types.UPDATE_NODE:
    tree = Tree.update(state.tree, action.data.id, action.data.node)
    return Object.assign({}, state, { tree })
  case types.REMOVE_NODE:
    tree = Tree.removeChild(state.tree, action.data.parent, action.data.id)
    return Object.assign({}, state, { tree })
  default:
    return state
  }
}

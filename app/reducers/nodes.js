import * as types from '../actions/nodes'

const defaultState = { tree: null }

export default function nodes (state = defaultState, action) {
  switch (action.type) {
  case types.INDEX_NODES:
    return Object.assign({}, state, action.data)
  case types.ADD_NODE:
    return Object.assign({}, state)
  default:
    return state
  }
}

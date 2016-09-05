import * as types from '../actions/ui'

const defaultState = {
  expanded: [],
  editing: null
}

export default function nodes (state = defaultState, action) {
  switch (action.type) {
  case types.SET_IS_EDITING:
    return Object.assign({}, state, { editing: action.data.id })
  case types.UNSET_IS_EDITING:
    return Object.assign({}, state, { editing: null })
  case types.EXPAND:
    return state
  case types.COLLAPSE:
    return state
  default:
    return state
  }
}

export function isEditing (state, id, type) {
  const idString = type ? `${ id }.${ type }` : id
  return state.editing === idString
}

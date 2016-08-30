import * as types from '../actions/ui'

const defaultState = {
  expanded: [],
  isEditing: null
}

export default function nodes (state = defaultState, action) {
  switch (action.type) {
  case types.SET_IS_EDITING:
    return Object.assign({}, state, { isEditing: action.data.id })
  case types.UNSET_IS_EDITING:
    return Object.assign({}, state, { isEditing: null })
  case types.EXPAND:
    return state
  case types.COLLAPSE:
    return state
  default:
    return state
  }
}

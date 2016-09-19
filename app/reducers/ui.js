import * as types from '../actions/ui'
import ImmutableArray from '../lib/ImmutableArray'
import storage from '../lib/storage'

const expandedKey = 'ui.expanded'

const defaultState = {
  editing: null,
  expanded: []
}

export default function nodes (state = defaultState, action) {
  let expanded
  switch (action.type) {
  case types.INIT:
    expanded = storage.get(expandedKey)
    expanded = Array.isArray(expanded) ? expanded : []
    return Object.assign({}, state, { expanded })
  case types.SET_IS_EDITING:
    return Object.assign({}, state, { editing: action.data.id })
  case types.UNSET_IS_EDITING:
    return Object.assign({}, state, { editing: null })
  case types.EXPAND:
    expanded = ImmutableArray.add(state.expanded, action.data.id)
    storage.set(expandedKey, expanded)
    return Object.assign({}, state, { expanded })
  case types.COLLAPSE:
    expanded = ImmutableArray.remove(state.expanded, action.data.id)
    storage.set(expandedKey, expanded)
    return Object.assign({}, state, { expanded })
  default:
    return state
  }
}

// @TODO: Move to seperate file
export function isEditing (state, id, type) {
  const idString = type ? `${ id }.${ type }` : id
  return state.editing === idString
}

// @TODO: Move to seperate file
export function isExpanded (state, id) {
  return state.expanded.includes(id)
}

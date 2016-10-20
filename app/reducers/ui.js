/* @flow */

import * as types from '../actions/ui'
import ImmutableArray from '../lib/ImmutableArray'
import Storage, { keys } from '../lib/Storage'

import type { UIState, UIAction } from '../../flow/types'

const expandedKey = keys[0]

const defaultState: UIState = {
  editing: null,
  showButtons: null,
  expanded: []
}

export default function nodes (state: UIState = defaultState, action: UIAction) {
  let expanded
  switch (action.type) {
  case types.INIT:
    expanded = Storage.get(expandedKey)
    expanded = Array.isArray(expanded) ? expanded : []
    return Object.assign({}, state, { expanded })
  case types.SET_IS_EDITING:
    return Object.assign({}, state, { editing: action.data.uid })
  case types.UNSET_IS_EDITING:
    return Object.assign({}, state, { editing: null })
  case types.SET_SHOW_BUTTONS:
    return Object.assign({}, state, { showButtons: action.data.uid })
  case types.UNSET_SHOW_BUTTONS:
    return Object.assign({}, state, { showButtons: null })
  case types.EXPAND:
    expanded = ImmutableArray.add(state.expanded, action.data.uid)
    Storage.set(expandedKey, expanded)
    return Object.assign({}, state, { expanded })
  case types.COLLAPSE:
    expanded = ImmutableArray.remove(state.expanded, action.data.uid)
    Storage.set(expandedKey, expanded)
    return Object.assign({}, state, { expanded })
  default:
    return state
  }
}

// @TODO: Move to seperate file
export function isEditing (state: UIState, uid: string, type?: string) {
  const uidString = type ? `${ uid }.${ type }` : uid
  return state.editing === uidString
}

// @TODO: Move to seperate file
export function hasButtonsShown (state: UIState, uid: string) {
  return state.showButtons === uid
}

// @TODO: Move to seperate file
export function isExpanded (state: UIState, uid: string) {
  return state.expanded.includes(uid)
}

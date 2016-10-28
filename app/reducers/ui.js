/* @flow */

import * as types from '../actions/ui'
import { Set } from 'immutable'
import Storage from '../lib/Storage'

import type { UIState, UIAction } from '../../flow/types'

import EXPANDED_KEY from '../settings/EXPANDED_KEY'

const defaultState: UIState = {
  lang: 'en',
  editing: null,
  showButtons: null,
  expanded: []
}

export default function nodes (state: UIState = defaultState, action: UIAction) {
  let expanded, set
  switch (action.type) {
  case types.INIT_EXPANDED:
    expanded = action.data.expanded
    return { ...state, expanded }
  case types.EXPAND:
    set = Set(state.expanded)
    expanded = set.add(action.data.uid).toJS()
    Storage.set(EXPANDED_KEY, expanded)
    return { ...state, expanded }
  case types.TOGGLE_EXPANDED:
    set = Set(state.expanded)
    if (!set.has(action.data.uid)) {
      expanded = set.add(action.data.uid).toJS()
    } else {
      expanded = set.remove(action.data.uid).toJS()
    }
    Storage.set(EXPANDED_KEY, expanded)
    return { ...state, expanded }
  case types.SET_IS_EDITING:
    return { ...state, editing: action.data.uid }
  case types.UNSET_IS_EDITING:
    return { ...state, editing: null }
  case types.SET_SHOW_BUTTONS:
    return { ...state, showButtons: action.data.uid }
  case types.UNSET_SHOW_BUTTONS:
    return { ...state, showButtons: null }
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

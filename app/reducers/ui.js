/* @flow */

import type { UIState, UIAction } from '../../flow/types'
import {
  SET_UI_KEY,
  UNSET_UI_KEY,
  SET_EXPANDED,
  UNSET_EXPANDED,
  UNSET_EXPANDED_DEEP
} from '../actions/ui'
import { fromJS } from 'immutable'
import arraysEqual from '../lib/utils/arraysEqual'

export const defaultState: UIState = {
  expanded: {},
  active: null,
  editing: null,
  adding: null,
  movingChild: null,
  buttonsShown: null,
  dragging: null
}

export default function (state: UIState = defaultState, action: UIAction) : UIState { // eslint-disable-line complexity

  switch (action.type) {

  case SET_UI_KEY:
    if (action.data.treePath != null && action.data.key != null) {
      const active = action.data.key === 'active' ? action.data.treePath : state.active
      const editing = action.data.key === 'editing' ? action.data.treePath : state.editing
      const adding = action.data.key === 'adding' ? action.data.treePath : state.adding
      const movingChild = action.data.key === 'movingChild' ? action.data.treePath : state.movingChild
      const buttonsShown = action.data.key === 'buttonsShown' ? action.data.treePath : state.buttonsShown
      const dragging = action.data.key === 'dragging' ? action.data.treePath : state.dragging
      return { ...state, active, editing, adding, movingChild, buttonsShown, dragging }
    }
    return state

  case UNSET_UI_KEY:
    if (action.data.key != null) {
      const active = action.data.key === 'active' ? null : state.active
      const editing = action.data.key === 'editing' ? null : state.editing
      const adding = action.data.key === 'adding' ? null : state.adding
      const movingChild = action.data.key === 'movingChild' ? null : state.movingChild
      const buttonsShown = action.data.key === 'buttonsShown' ? null : state.buttonsShown
      const dragging = action.data.key === 'dragging' ? null : state.dragging
      return { ...state, active, editing, adding, movingChild, buttonsShown, dragging }
    }
    return state

  case SET_EXPANDED:
    if (action.data.treePath != null) {
      const treePath = action.data.treePath
      const keys = Object.keys(state.expanded)
      // Check if not already expanded
      let isExpanded = false
      keys.forEach(key => {
        const expanded = state.expanded[key]
        if (arraysEqual(expanded, treePath)) {
          isExpanded = true
        }
      })
      if (isExpanded) return state
      // Add to state.expanded
      const key = keys.length === 0 ? '0' : Math.max(...keys.map(k => parseInt(k, 10))) + 1
      const expanded = fromJS(state.expanded).set(key, treePath).toJS() // eslint-disable-line newline-per-chained-call
      return { ...state, expanded }
    }
    return state

  case UNSET_EXPANDED:
    if (action.data.treePath != null) {
      const treePath = action.data.treePath
      let key
      Object.keys(state.expanded).forEach(k => {
        if (arraysEqual(state.expanded[k], treePath)) {
          key = k
        }
      })
      const expanded = key != null ? fromJS(state.expanded).delete(key).toJS() : state.expanded // eslint-disable-line newline-per-chained-call
      return { ...state, expanded }
    }
    return state

  case UNSET_EXPANDED_DEEP:
    if (action.data.treePath != null) {
      const treePath = action.data.treePath
      const keys = []
      Object.keys(state.expanded).forEach(k => {
        const expanded = state.expanded[k].slice(0, treePath.length)
        if (arraysEqual(expanded, treePath)) {
          keys.push(k)
        }
      })
      let expanded = fromJS(state.expanded)
      keys.forEach(key => expanded = expanded.delete(key))
      expanded = expanded.toJS()
      return { ...state, expanded }
    }
    return state

  default:
    return state
  }

}

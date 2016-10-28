/* @flow */

export const SET_IS_EDITING = 'SET_IS_EDITING'
export function setIsEditing (uid: string, type: string) {
  const uidString = type ? `${ uid }.${ type }` : uid
  return {
    type: SET_IS_EDITING,
    data: {
      uid: uidString
    }
  }
}

export const UNSET_IS_EDITING = 'UNSET_IS_EDITING'
export function unsetIsEditing () {
  return {
    type: UNSET_IS_EDITING
  }
}

export const SET_IS_DRAGGING = 'SET_IS_DRAGGING'
export function setIsDragging (uid: string) {
  return {
    type: SET_IS_DRAGGING,
    data: {
      uid
    }
  }
}

export const UNSET_IS_DRAGGING = 'UNSET_IS_DRAGGING'
export function unsetIsDragging () {
  return {
    type: UNSET_IS_DRAGGING
  }
}

export const SET_SHOW_BUTTONS = 'SET_SHOW_BUTTONS'
export function setShowButtons (uid: string) {
  return {
    type: SET_SHOW_BUTTONS,
    data: {
      uid
    }
  }
}

export const UNSET_SHOW_BUTTONS = 'UNSET_SHOW_BUTTONS'
export function unsetShowButtons () {
  return {
    type: UNSET_SHOW_BUTTONS
  }
}

export const INIT_EXPANDED = 'INIT_EXPANDED'
export function initExpanded (expanded: string[]) {
  return {
    type: INIT_EXPANDED,
    data: { expanded }
  }
}

export const EXPAND = 'EXPAND'
export function expand (uid: string) {
  return {
    type: EXPAND,
    data: {
      uid
    }
  }
}

export const TOGGLE_EXPANDED = 'TOGGLE_EXPANDED'
export function toggleExpanded (uid: string) {
  return {
    type: TOGGLE_EXPANDED,
    data: {
      uid
    }
  }
}

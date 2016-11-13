/* @flow */

export const SET_IS_ACTIVE = 'SET_IS_ACTIVE'
export function setIsActive (uid: string) {
  return {
    type: SET_IS_ACTIVE,
    data: {
      uid
    }
  }
}

export const UNSET_IS_ACTIVE = 'UNSET_IS_ACTIVE'
export function unsetIsActive () {
  return {
    type: UNSET_IS_ACTIVE
  }
}

export const SET_IS_MOVING_CHILD = 'SET_IS_MOVING_CHILD'
export function setIsMovingChild (uid: string) {
  return {
    type: SET_IS_MOVING_CHILD,
    data: {
      uid
    }
  }
}

export const UNSET_IS_MOVING_CHILD = 'UNSET_IS_MOVING_CHILD'
export function unsetIsMovingChild () {
  return {
    type: UNSET_IS_MOVING_CHILD
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

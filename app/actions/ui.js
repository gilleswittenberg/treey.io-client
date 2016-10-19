export const INIT = 'INIT'
export function init () {
  return {
    type: INIT
  }
}

export const SET_IS_EDITING = 'SET_IS_EDITING'
export function setIsEditing (uid, type) {
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

export const SET_SHOW_BUTTONS = 'SET_SHOW_BUTTONS'
export function setShowButtons (uid) {
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

export function toggleExpanded (uid) {
  return (dispatch, getState) => {
    const action = getState().ui.expanded.includes(uid) ? collapse : expand
    dispatch(action(uid))
  }
}

export const EXPAND = 'EXPAND'
export function expand (uid) {
  return {
    type: EXPAND,
    data: {
      uid
    }
  }
}

export const COLLAPSE = 'COLLAPSE'
export function collapse (uid) {
  return {
    type: COLLAPSE,
    data: {
      uid
    }
  }
}

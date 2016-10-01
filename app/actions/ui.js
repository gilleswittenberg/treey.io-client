export const INIT = 'INIT'
export function init () {
  return {
    type: INIT
  }
}

export const SET_IS_EDITING = 'SET_IS_EDITING'
export function setIsEditing (id, type) {
  const idString = type ? `${ id }.${ type }` : id
  return {
    type: SET_IS_EDITING,
    data: {
      id: idString
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
export function setShowButtons (id) {
  return {
    type: SET_SHOW_BUTTONS,
    data: {
      id
    }
  }
}

export const UNSET_SHOW_BUTTONS = 'UNSET_SHOW_BUTTONS'
export function unsetShowButtons () {
  return {
    type: UNSET_SHOW_BUTTONS
  }
}

export function toggleExpanded (id) {
  return (dispatch, getState) => {
    const action = getState().ui.expanded.includes(id) ? collapse : expand
    dispatch(action(id))
  }
}

export const EXPAND = 'EXPAND'
export function expand (id) {
  return {
    type: EXPAND,
    data: {
      id
    }
  }
}

export const COLLAPSE = 'COLLAPSE'
export function collapse (id) {
  return {
    type: COLLAPSE,
    data: {
      id
    }
  }
}

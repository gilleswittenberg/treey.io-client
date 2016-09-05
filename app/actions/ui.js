export const SET_IS_EDITING = 'SET_IS_EDITING'
export function setIsEditing () {
  const id = arguments[arguments.length - 1]
  return {
    type: SET_IS_EDITING,
    data: {
      id
    }
  }
}

export const UNSET_IS_EDITING = 'UNSET_IS_EDITING'
export function unsetIsEditing () {
  return {
    type: UNSET_IS_EDITING,
  }
}

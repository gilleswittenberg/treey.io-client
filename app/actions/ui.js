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

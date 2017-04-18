import type { IndexPath } from '../../flow/tree'

// ui
export const CLEAR_NODE_UI = 'CLEAR_NODE_UI'
export const UPDATE_NODE_UI = 'UPDATE_NODE_UI'

export const clearUIEditingAdding = () => {
  return {
    type: CLEAR_NODE_UI,
    data: {
      keys: ['editing', 'adding']
    }
  }
}

export const SET_UI_EDITING = 'SET_UI_EDITING'
export const setUIEditing = (indexPath: IndexPath, value: boolean = true) => {
  return [
    clearUIEditingAdding(),
    {
      type: UPDATE_NODE_UI,
      data: {
        indexPath,
        key: 'editing',
        value
      }
    }
  ]
}

export const SET_UI_ADDING = 'SET_UI_ADDING'
export const setUIAdding = (indexPath: IndexPath, value: boolean = true) => {
  return [
    clearUIEditingAdding(),
    {
      type: UPDATE_NODE_UI,
      data: {
        indexPath,
        key: 'adding',
        value
      }
    }
  ]
}

export const setUIActive = (indexPath: IndexPath, value: boolean = true) => {
  return [
    {
      type: CLEAR_NODE_UI,
      data: {
        keys: ['active']
      }
    },
    {
      type: UPDATE_NODE_UI,
      data: {
        indexPath,
        key: 'active',
        value
      }
    }
  ]
}

export const setUIExpanded = (indexPath: IndexPath, value: boolean = true) => {
  return {
    type: UPDATE_NODE_UI,
    data: {
      indexPath,
      key: 'expanded',
      value
    }
  }
}

export const clearUIMovingChild = () => {
  return {
    type: CLEAR_NODE_UI,
    data: {
      keys: ['movingChild']
    }
  }
}

export const clearUIButtonsShown = () => {
  return {
    type: CLEAR_NODE_UI,
    data: {
      keys: ['buttonsShown']
    }
  }
}

export const clearUIDragging = () => {
  return {
    type: CLEAR_NODE_UI,
    data: {
      keys: ['dragging']
    }
  }
}

export const setUIMovingChild = (indexPath: IndexPath, value: boolean = true) => {
  return [
    clearUIMovingChild(),
    {
      type: UPDATE_NODE_UI,
      data: {
        indexPath,
        key: 'movingChild',
        value
      }
    }
  ]
}

export const setUIDragging = (indexPath: IndexPath, value: boolean = true) => {
  return [
    clearUIDragging(),
    {
      type: UPDATE_NODE_UI,
      data: {
        indexPath,
        key: 'dragging',
        value
      }
    }
  ]
}

export const setUIButtonsShown = (indexPath: IndexPath, value: boolean = true) => {
  return [
    clearUIButtonsShown(),
    {
      type: UPDATE_NODE_UI,
      data: {
        indexPath,
        key: 'buttonsShown',
        value
      }
    }
  ]
}

export const UPDATE_ACTIVE_NODE_UI = 'UPDATE_ACTIVE_NODE_UI'
export const updateActiveNodeUI = (key: string, value: boolean = true) => {
  return {
    type: UPDATE_ACTIVE_NODE_UI,
    data: {
      key,
      value
    }
  }
}

export const SET_NEXT_UI_ACTIVE = 'SET_NEXT_UI_ACTIVE'
export const setNextUIActive = () => {
  return {
    type: SET_NEXT_UI_ACTIVE
  }
}
export const SET_PREV_UI_ACTIVE = 'SET_PREV_UI_ACTIVE'
export const setPrevUIActive = () => {
  return {
    type: SET_PREV_UI_ACTIVE
  }
}

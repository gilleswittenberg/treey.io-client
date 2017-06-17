/* @flow */

import noop from '../utils/noop'

export const defaultActions = {

  postAuthenticate: noop,
  postRegister: noop,
  postSignOut: noop,

  getNodes: noop,
  create: noop,
  update: noop,
  remove: noop,
  move: noop,

  clearUIEditingAdding: noop,
  setUIEditing: noop,
  setUIAdding: noop,
  setUIExpanded: noop,
  unsetUIExpanded: noop,
  setUIDragging: noop,
  clearUIDragging: noop,
  setUIActive: noop,
  setUIMovingChild: noop,
  clearUIMovingChild: noop,
  setUIButtonsShown: noop,
  clearUIButtonsShown: noop
}

import { bindActionCreators } from 'redux'
import {
  postAuthenticate,
  postRegister,
  postSignOut
} from '../../actions/user'
import {
  getNodes,
  create,
  update,
  remove,
  move
} from '../../actions/nodes'
import {
  clearUIEditingAdding,
  setUIEditing,
  setUIAdding,
  setUIExpanded,
  unsetUIExpanded,
  setUIDragging,
  clearUIDragging,
  setUIMovingChild,
  clearUIMovingChild,
  setUIActive,
  setUIButtonsShown,
  clearUIButtonsShown
} from '../../actions/ui'

let actions = {
  postAuthenticate,
  postRegister,
  postSignOut,

  getNodes,
  create,
  update,
  remove,
  move,

  clearUIEditingAdding,
  setUIEditing,
  setUIAdding,
  setUIExpanded,
  unsetUIExpanded,
  setUIDragging,
  clearUIDragging,
  setUIMovingChild,
  clearUIMovingChild,
  setUIActive,
  setUIButtonsShown,
  clearUIButtonsShown
}

let boundActions

export default (dispatch: () => void) => {
  if (boundActions == null) {
    boundActions = bindActionCreators(actions, dispatch)
  }
  return { ...boundActions }
}

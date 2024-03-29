/* @flow */

import type { Dispatch } from '../../../flow/types'

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
  syncTransaction: noop,
  cancelTransaction: noop,
  revertTransaction: noop,

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
  move,
  syncTransaction,
  cancelTransaction,
  revertTransaction
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

const actions = {
  postAuthenticate,
  postRegister,
  postSignOut,

  getNodes,
  create,
  update,
  remove,
  move,
  syncTransaction,
  cancelTransaction,
  revertTransaction,

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

export default (dispatch: Dispatch) => {
  if (boundActions == null) {
    boundActions = bindActionCreators(actions, dispatch)
  }
  return { ...boundActions }
}

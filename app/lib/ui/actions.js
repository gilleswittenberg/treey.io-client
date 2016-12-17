/* @flow */

import noop from '../utils/noop'

export const defaultActions = {
  postNode: noop,
  putNode: noop,
  deleteNode: noop,
  putMoveNode: noop,
  clearUIEditingAdding: noop,
  setUIEditing: noop,
  setUIAdding: noop,
  setUIExpanded: noop,
  setUIDragging: noop,
  clearUIDragging: noop,
  setUIActive: noop,
  setUIMovingChild: noop,
  clearUIMovingChild: noop,
  setUIButtonsShown: noop,
  clearUIButtonsShown: noop,
  updateActiveNodeUI: noop,
  setNextUIActive: noop,
  setPrevUIActive: noop
}

import { bindActionCreators } from 'redux'
import {
  postNode,
  putNode,
  deleteNode,
  putMoveNode,
  clearUIEditingAdding,
  setUIEditing,
  setUIAdding,
  setUIExpanded,
  setUIDragging,
  clearUIDragging,
  setUIMovingChild,
  clearUIMovingChild,
  setUIActive,
  setUIButtonsShown,
  clearUIButtonsShown,
  updateActiveNodeUI,
  setNextUIActive,
  setPrevUIActive
} from '../../actions/nodes'

let nodesActions = {
  postNode,
  putNode,
  deleteNode,
  putMoveNode,
  clearUIEditingAdding,
  setUIEditing,
  setUIAdding,
  setUIExpanded,
  setUIDragging,
  clearUIDragging,
  setUIMovingChild,
  clearUIMovingChild,
  setUIActive,
  setUIButtonsShown,
  clearUIButtonsShown,
  updateActiveNodeUI,
  setNextUIActive,
  setPrevUIActive
}

export default function (dispatch: any) {

  const nodesActionsBound = bindActionCreators(nodesActions, dispatch)
  return { ...nodesActionsBound }
}

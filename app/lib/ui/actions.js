/* @flow */

import noop from '../utils/noop'

export const defaultActions = {
  postNode: noop,
  putNode: noop,
  deleteNode: noop,
  putMoveNode: noop,
  clearNodeUI: noop,
  clearUIEditing: noop,
  setUIEditing: noop,
  setUIAdding: noop,
  setUIExpanded: noop,
  setUIDragging: noop,
  setUIActive: noop,
  setUIMovingChild: noop,
  setUIButtonsShown: noop,
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
  clearNodeUI,
  clearUIEditing,
  setUIEditing,
  setUIAdding,
  setUIExpanded,
  setUIDragging,
  setUIMovingChild,
  setUIActive,
  setUIButtonsShown,
  updateActiveNodeUI,
  setNextUIActive,
  setPrevUIActive
} from '../../actions/nodes'

let nodesActions = {
  postNode,
  putNode,
  deleteNode,
  putMoveNode,
  clearNodeUI,
  clearUIEditing,
  setUIEditing,
  setUIAdding,
  setUIExpanded,
  setUIDragging,
  setUIMovingChild,
  setUIActive,
  setUIButtonsShown,
  updateActiveNodeUI,
  setNextUIActive,
  setPrevUIActive
}

export default function (dispatch: any) {

  const nodesActionsBound = bindActionCreators(nodesActions, dispatch)
  return { ...nodesActionsBound }
}

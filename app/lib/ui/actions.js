/* @flow */

import noop from '../utils/noop'

export const defaultActions = {
  postNode: noop,
  putNode: noop,
  deleteNode: noop,
  putMoveNode: noop,
  clearNodeUI: noop,
  updateNodeUI: noop,
  clearUIEditing: noop,
  setUIEditing: noop,
  setUIAdding: noop,
  setUIExpanded: noop,
  setUIDragging: noop,
  setUIMovingChild: noop,
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
  updateNodeUI,
  clearUIEditing,
  setUIEditing,
  setUIAdding,
  setUIExpanded,
  setUIDragging,
  setUIMovingChild,
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
  updateNodeUI,
  clearUIEditing,
  setUIEditing,
  setUIAdding,
  setUIExpanded,
  setUIDragging,
  setUIMovingChild,
  updateActiveNodeUI,
  setNextUIActive,
  setPrevUIActive
}

export default function (dispatch: any) {

  const nodesActionsBound = bindActionCreators(nodesActions, dispatch)
  return { ...nodesActionsBound }
}

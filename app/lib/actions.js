/* @flow */

import noop from './noop'

export const defaultActions = {
  // @TODO: remove
  setIsMovingChild: noop,
  unsetIsMovingChild: noop,
  setIsDragging: noop,
  unsetIsDragging: noop,

  postNode: noop,
  putNode: noop,
  deleteNode: noop,
  putMoveNode: noop,
  clearNodeUI: noop,
  updateNodeUI: noop,
  updateActiveNodeUI: noop,
  setNextUIActive: noop,
  setPrevUIActive: noop
}

import { bindActionCreators } from 'redux'
import {
  // @TODO: remove
  setIsMovingChild,
  unsetIsMovingChild,
  setIsDragging,
  unsetIsDragging
} from '../actions/ui'
import {
  postNode,
  putNode,
  deleteNode,
  putMoveNode,
  clearNodeUI,
  updateNodeUI,
  updateActiveNodeUI,
  setNextUIActive,
  setPrevUIActive
} from '../actions/nodes'

let nodesActions = {
  postNode,
  putNode,
  deleteNode,
  putMoveNode,
  clearNodeUI,
  updateNodeUI,
  updateActiveNodeUI,
  setNextUIActive,
  setPrevUIActive
}
// @TODO: remove
let uiActions = {
  setIsMovingChild,
  unsetIsMovingChild,
  setIsDragging,
  unsetIsDragging
}

export default function (dispatch: any) {

  // @TODO: remove
  const uiActionsBound = bindActionCreators(uiActions, dispatch)
  const nodesActionsBound = bindActionCreators(nodesActions, dispatch)
  return { ...uiActionsBound, ...nodesActionsBound }
}

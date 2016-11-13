/* @flow */

import noop from './noop'

export const defaultActions = {
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

export default function (dispatch: any) {

  const nodesActionsBound = bindActionCreators(nodesActions, dispatch)
  return { ...nodesActionsBound }
}

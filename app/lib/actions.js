/* @flow */

import noop from './noop'

export const defaultActions = {
  setIsActive: noop,
  unsetIsActive: noop,
  setIsEditing: noop,
  unsetIsEditing: noop,
  setIsMovingChild: noop,
  unsetIsMovingChild: noop,
  setIsDragging: noop,
  unsetIsDragging: noop,
  expand: noop,
  toggleExpanded: noop,
  setShowButtons: noop,
  postNode: noop,
  putNode: noop,
  deleteNode: noop,
  putMoveNode: noop
}

import { bindActionCreators } from 'redux'
import {
  setIsActive,
  unsetIsActive,
  setIsEditing,
  unsetIsEditing,
  setIsMovingChild,
  unsetIsMovingChild,
  setIsDragging,
  unsetIsDragging,
  setShowButtons,
  expand,
  toggleExpanded
} from '../actions/ui'
import {
  postNode,
  putNode,
  deleteNode,
  putMoveNode
} from '../actions/nodes'

let nodesActions = {
  postNode,
  putNode,
  deleteNode,
  putMoveNode
}
let uiActions = {
  setIsActive,
  unsetIsActive,
  setIsEditing,
  unsetIsEditing,
  setIsMovingChild,
  unsetIsMovingChild,
  setIsDragging,
  unsetIsDragging,
  setShowButtons,
  expand,
  toggleExpanded
}

export default function (dispatch: any) {

  const uiActionsBound = bindActionCreators(uiActions, dispatch)
  const nodesActionsBound = bindActionCreators(nodesActions, dispatch)
  return { ...uiActionsBound, ...nodesActionsBound }
}

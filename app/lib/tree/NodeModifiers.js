/* @flow */

import type { Node, NodeId, NodeUser, NodeData, NodeUI } from '../../../flow/tree'

import { fromJS } from 'immutable'
import defaultUI from '../ui/defaultUI'

export const createNode = (id?: NodeId, user?: NodeUser, data?: NodeData, ui?: NodeUI) : Node => {
  const uid = id != null ? id : null
  const userValue = user || null
  const dataValue = data || { title: '' }
  const uiValue = ui || defaultUI
  return {
    uid,
    user: userValue,
    data: dataValue,
    ui: uiValue
  }
}

export const updateNode = (node: Node, id?: NodeId, data?: NodeData, ui?: NodeUI) : Node => {
  let nodeMap = fromJS(node)
  if (id != null) nodeMap = nodeMap.set('uid', id)
  if (data != null) nodeMap = nodeMap.mergeIn(['data'], fromJS(data))
  if (ui != null) nodeMap = nodeMap.mergeIn(['ui'], fromJS(ui))
  return nodeMap.toJS()
}

export const parseNode = (obj: { uid?: NodeId, user?: string, data?: NodeData }) : Node => {
  const id = obj.uid != null ? obj.uid : undefined
  return createNode(id, obj.user, obj.data)
}

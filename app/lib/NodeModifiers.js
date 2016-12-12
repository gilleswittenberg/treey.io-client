/* @flow */

import type {
  Node,
  NodeId,
  NodeData,
  NodeUI
} from '../../flow/tree'

import { fromJS } from 'immutable'
import defaultUI from '../../app/lib/defaultUI'

export const createNode = (id?: NodeId, data?: NodeData, ui?: NodeUI) : Node => {
  const uid = id != null ? id : null
  data = data || { title: '' }
  ui = ui || defaultUI
  return {
    uid,
    data,
    ui
  }
}

export const updateNode = (node: Node, id?: NodeId, data?: NodeData, ui?: NodeUI) : Node => {
  let nodeMap = fromJS(node)
  if (id != null) nodeMap = nodeMap.set('uid', id)
  if (data != null) nodeMap = nodeMap.mergeIn(['data'], fromJS(data))
  if (ui != null) nodeMap = nodeMap.mergeIn(['ui'], fromJS(ui))
  return nodeMap.toJS()
}

export const parseNode = (obj: { uid?: string, title?: string }) : Node => {
  const id = obj.uid != null ? obj.uid : undefined
  const data = obj.title != null ? { title: obj.title } : undefined
  return createNode(id, data)
}

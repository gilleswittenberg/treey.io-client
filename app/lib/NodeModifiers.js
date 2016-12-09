/* @flow */

import type {
  Node,
  NodeId,
  NodeData,
  NodeUI,
  TreePath
} from '../../flow/tree'

import { fromJS } from 'immutable'
import defaultUI from '../../app/lib/defaultUI'
import ID from '../settings/TREE_ID_KEY'

export const createNode = (id: ?NodeId, data: ?NodeData, ui: ?NodeUI) : Node => {
  id = id || null
  data = data || { title: '' }
  ui = ui || defaultUI
  return {
    uid: id,
    data,
    ui,
    nodes: []
  }
}

export const updateNode = (node: Node, id: ?NodeId, data: ?NodeData, ui: ?NodeUI) : Node => {
  node = fromJS(node)
  if (id) node = node.set(ID, id)
  if (data) node = node.mergeIn(['data'], fromJS(data))
  if (ui) node = node.mergeIn(['ui'], fromJS(ui))
  return node.toJS()
}

export const parseTreeNode = (obj: { uid: ?string, title: ?string }) : Node => {
  const id = obj.uid
  const data = {}
  if (obj.title != null) {
    data.title = obj.title
  }
  return createNode(id, data)
}

export const setPathOnNode = (node: Node, parentPath: TreePath = []) : Node => {
  let path = parentPath
  if (node.uid != null) {
    path.push(node.uid)
  }
  node.path = path
  return node
}

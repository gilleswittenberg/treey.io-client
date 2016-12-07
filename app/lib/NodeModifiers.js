/* @flow */

import type {
  Node,
  NodeId,
  NodeData,
  NodeUI
} from '../../flow/tree'

import { fromJS } from 'immutable'
import defaultUI from '../../app/lib/defaultUI'
import ID from '../settings/TREE_ID_KEY'

export const create = function (id: ?NodeId, data: ?NodeData, ui: ?NodeUI) : Node {
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

export const update = function (node: Node, id: ?NodeId, data: ?NodeData, ui: ?NodeUI) : Node {
  node = fromJS(node)
  if (id) node = node.set(ID, id)
  if (data) node = node.mergeIn(['data'], fromJS(data))
  if (ui) node = node.mergeIn(['ui'], fromJS(ui))
  return node.toJS()
}

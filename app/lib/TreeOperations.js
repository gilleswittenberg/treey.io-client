/* @flow */

import type {
  NodeId,
  TreeData,
  TreePath,
  // NodeId,
  NodeData,
  NodeUI
} from '../../flow/tree'

import { create } from './NodeModifiers'
import { getNode, indexNodes, addNode, updateNode, removeNode, updateNodes } from './TreeModifiers'

export const index = (data: TreeData) => {
  return indexNodes(data)
}

export const createAndAdd = (tree: TreeData, path: TreePath, data: NodeData) => {
  const node = create(undefined, data)
  return addNode(tree, path, node)
}

export const update = (tree: TreeData, path: TreePath, data: NodeData) => {
  return updateNode(tree, path, data)
}

export const remove = (tree: TreeData, path: TreePath) => {
  return removeNode(tree, path)
}

export const move = (tree: TreeData, path: TreePath, newPath: TreePath, before: ?NodeId) => {
  const node = getNode(tree, path)
  if (node != null) {
    tree = removeNode(tree, path)
    tree = addNode(tree, newPath, node, before)
  }
  return tree
}

export const setUI = (tree: TreeData, path: TreePath, ui: NodeUI) => {
  return updateNode(tree, path, null, ui)
}

export const setUIUnique = (tree: TreeData, path: TreePath, ui: NodeUI) => {

  // @TODO: extract
  const invertedUI = {}
  Object.keys(ui).forEach(key => invertedUI[key] = !ui[key])
  tree = updateNodes(tree, undefined, invertedUI)
  tree = updateNode(tree, path, undefined, ui)
  return tree
}

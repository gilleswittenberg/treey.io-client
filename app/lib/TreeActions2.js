/* @flow */

import type {
  TreeData,
  TreePath,
  // NodeId,
  NodeData,
  NodeUI
} from '../../flow/tree'

import { create/* , getNode */, addNode, updateNode, removeNode, updateNodes } from './treeModifiers'

/*
export const index = (data: TreeData) => {
  // parse
}
*/

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

/*
// @TODO: Implement
export const move = (tree: TreeData, path: TreePath, newPath: TreePath, before: NodeId) => {
  // @TODO: Return Node
  const node = getNode(tree, path)
  tree = removeNode(tree, path)
  tree = addNode(tree, newPath, node, before)
  return tree
}
*/

export const setUI = (tree: TreeData, path: TreePath, ui: NodeUI) => {
  return updateNode(tree, path, undefined, ui)
}

export const setUIUnique = (tree: TreeData, path: TreePath, ui: NodeUI) => {

  // @TODO: extract
  const invertedUI = ui
  Object.keys(invertedUI).forEach(key => invertedUI[key] = !invertedUI[key])
  tree = updateNodes(tree, undefined, invertedUI)
  tree = updateNode(tree, path, undefined, ui)
  return tree
}

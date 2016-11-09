/* @flow */

import { fromJS, List } from 'immutable'
import type { Node, NodeMap, NodesList } from '../../flow/types'

const idKey = 'uid'
const nodesKey = 'nodes'

function toJS (im: ?NodeMap) {
  return im ? im.toJS() : {}
}

const Tree = {

  _getKeyPath (node: NodeMap, id: string, addNodesKey: bool = false) {
    if (node.get(idKey) === id) {
      return addNodesKey ? [nodesKey] : []
    } else {
      const nodes: NodesList = node.get(nodesKey)
      if (List.isList(nodes)) {
        for (let i = 0, l = nodes.size; i < l; i++) {
          const path = this._getKeyPath(nodes.get(i), id, addNodesKey)
          if (path !== false) {
            return [].concat([nodesKey, i], path)
          }
        }
      }
    }
    return false
  },

  // @TODO: get indexes of ordered tree
  _pathToKeyPath (path: string) {
    const regexp = /^(\/[0-9a-f]{24})+$/
    if (!path.match(regexp)) return null
    const parts = path.split('/').filter(part => part !== '')
    if (parts.length <= 1) return []
    parts.shift()
    const ret = []
    parts.forEach(part => ret.push('nodes', part))
    return ret
  },

  _parseNode (nodeMap: NodeMap, parentPath: string = '') {
    let map = nodeMap
    let uid = map.get('uid')
    let path = `${ parentPath }/${ uid }`
    map = map.set('path', path)
    map = map.set('data', { title: nodeMap.get('title') })
    map = map.remove('title')
    const nodes: any = map.get('nodes')
    if (nodes) {
      const nodesList = nodes.map(node => this._parseNode.bind(this)(node, path))
      map = map.set('nodes', nodesList)
    }
    const ui = { expanded: false, active: false, dragging: false, hasButtonsShown: false, editing: false, movingChild: false }
    map = map.set('ui', ui)
    return map
  },

  parse (treeData: Node) {
    let tree = fromJS(treeData)
    tree = this._parseNode(tree)
    return toJS(tree)
  },

  setNodeKey (treeData: Node, uid: string, key: string, value: any) {
    let tree = fromJS(treeData)
    let keyPath = this._getKeyPath(tree, uid)
    let keys = key.split('.')
    keyPath = keyPath.concat(keys)
    tree = tree.setIn(keyPath, value)
    return toJS(tree)
  },

  create (treeData: Node, parent: string, data: {}) {
    let tree = fromJS(treeData)
    let keyPath = this._getKeyPath(tree, parent, true)
    // create empty list
    if (!List.isList(tree.getIn(keyPath))) {
      tree = tree.setIn(keyPath, new List())
    }
    let nodes = tree.getIn(keyPath)
    nodes = nodes.push(data)
    tree = tree.setIn(keyPath, nodes)
    return toJS(tree)
  },

  update (treeData: Node, id: string, data: {}) {
    let tree = fromJS(treeData)
    let keyPath = this._getKeyPath(tree, id)
    tree = tree.mergeIn(keyPath, data)
    return toJS(tree)
  },

  removeChild (treeData: Node, parent: string, id: string) {
    let tree = fromJS(treeData)
    let keyPath = this._getKeyPath(tree, parent, true)
    if (!keyPath) {
      return toJS(tree)
    }
    const nodes = tree.getIn(keyPath)
    const index = nodes.findIndex(entry => entry.get(idKey) === id)
    if (index > -1) {
      keyPath.push(index)
      tree = tree.deleteIn(keyPath)
    }
    return toJS(tree)
  },

  delete (treeData: Node, id: string) {
    let tree = fromJS(treeData)
    let keyPath = this._getKeyPath(tree, id)
    tree = tree.deleteIn(keyPath)
    return toJS(tree)
  },

  move (treeData: Node, parent: string, id: string, newParent: string, before: string) {
    let tree = fromJS(treeData)
    let keyPath = this._getKeyPath(tree, parent, true)
    let nodes = tree.getIn(keyPath)
    const index = nodes.findIndex(value => value.get(idKey) === id)
    const node = nodes.getIn([index])
    nodes = nodes.deleteIn([index])
    if (parent !== newParent) {
      tree = tree.setIn(keyPath, nodes)
      keyPath = this._getKeyPath(tree, newParent, true)
      nodes = tree.getIn(keyPath)
    }
    let beforeIndex
    if (before) {
      beforeIndex = nodes.findIndex(value => value.get(idKey) === before)
    }
    if (!nodes) {
      nodes = List()
    }
    if (beforeIndex !== undefined) {
      nodes = nodes.splice(beforeIndex, 0, node)
    } else {
      nodes = nodes.push(node)
    }
    tree = tree.setIn(keyPath, nodes)
    return toJS(tree)
  }
}

export default Tree

import Immutable from 'immutable'
import { List } from 'immutable'

const idKey = '_id'
const nodesKey = 'nodes'

const Tree = {

  _fromJS (tree) {
    return Immutable.fromJS(tree)
  },

  _toJS (im) {
    if (im === undefined) {
      return {}
    }
    return im.toJS()
  },

  _getKeyPath (node, id) {
    let keyPath = []
    if (node.get(idKey) === id) {
      return keyPath
    } else {
      const nodes = node.get(nodesKey)
      if (List.isList(nodes)) {
        for (let i = 0, l = nodes.size; i < l; i++) {
          const path = this._getKeyPath(nodes.get(i), id)
          if (path !== false) {
            return keyPath.concat([i], path)
          }
        }
      }
    }
    return false
  },

  _getKeyPathNodes (keyPath) {
    let arr = []
    keyPath.forEach(key => arr.push(nodesKey, key))
    arr.push(nodesKey)
    return arr
  },

  create (treeData, parent, data) {
    let tree = this._fromJS(treeData)
    let keyPath = this._getKeyPath(tree, parent)
    keyPath = this._getKeyPathNodes(keyPath)
    if (!List.isList(tree.getIn(keyPath))) {
      tree = tree.setIn(keyPath, new List())
    }
    let nodes = tree.getIn(keyPath)
    nodes = nodes.push(data)
    tree = tree.setIn(keyPath, nodes)
    return this._toJS(tree)
  },

  update (treeData, id, data) {
    let tree = this._fromJS(treeData)
    let keyPath = this._getKeyPath(tree, id)
    if (keyPath.length > 0) {
      keyPath = this._getKeyPathNodes(keyPath)
      keyPath.pop()
    }
    tree = tree.mergeIn(keyPath, data)
    return this._toJS(tree)
  },

  delete (treeData, id) {
    let tree = this._fromJS(treeData)
    let keyPath = this._getKeyPath(tree, id)
    if (keyPath.length > 0) {
      keyPath = this._getKeyPathNodes(keyPath)
      keyPath.pop()
    }
    tree = tree.deleteIn(keyPath)
    return this._toJS(tree)
  }
}

export default Tree

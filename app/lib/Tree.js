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

  _getKeyPath (node, id, addNodesKey = false) {
    if (node.get(idKey) === id) {
      return addNodesKey ? [nodesKey] : []
    } else {
      const nodes = node.get(nodesKey)
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

  create (treeData, parent, data) {
    let tree = this._fromJS(treeData)
    let keyPath = this._getKeyPath(tree, parent, true)
    // create empty list
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
    tree = tree.mergeIn(keyPath, data)
    return this._toJS(tree)
  },

  removeChild (treeData, parent, id) {
    let tree = this._fromJS(treeData)
    let keyPath = this._getKeyPath(tree, parent, true)
    if (!keyPath) {
      return this._toJS(tree)
    }
    const nodes = tree.getIn(keyPath)
    const index = nodes.findIndex(entry => entry.get(idKey) === id)
    if (index > -1) {
      keyPath.push(index)
      tree = tree.deleteIn(keyPath)
    }
    return this._toJS(tree)
  },

  delete (treeData, id) {
    let tree = this._fromJS(treeData)
    let keyPath = this._getKeyPath(tree, id)
    tree = tree.deleteIn(keyPath)
    return this._toJS(tree)
  }
}

export default Tree

import { fromJS } from 'immutable'
import type { NodeUI, Node, NodeMap } from '../../flow/types'

const idKey = 'uid'
const nodesKey = 'nodes'

export const defaultNodeUI: NodeUI = {
  active: false,
  expanded: false,
  adding: false,
  editing: false,
  dragging: false,
  movingChild: false,
  buttonsShown: false
}

function toJS (im: ?NodeMap) {
  return im ? im.toJS() : {}
}

const TreeParse = {

  _getPath (parentPath: string[], id: string) : string[] {
    parentPath = fromJS(parentPath)
    parentPath = parentPath.push(id)
    return parentPath
  },

  _parseNode (nodeMap: NodeMap, parentPath: string[] = []) : NodeMap {
    let map = nodeMap
    let id = map.get(idKey)
    let path = this._getPath(parentPath, id)
    map = map.set('path', path)
    map = map.set('data', { title: nodeMap.get('title') })
    map = map.remove('title')
    map = map.set('ui', defaultNodeUI)
    const nodes: any = map.get(nodesKey)
    if (nodes) {
      const nodesList = nodes.map(node => this._parseNode.bind(this)(node, path))
      map = map.set(nodesKey, nodesList)
    }
    return map
  },

  parse (treeData: Node) {
    let tree = fromJS(treeData)
    tree = this._parseNode(tree)
    return toJS(tree)
  }
}

export default TreeParse

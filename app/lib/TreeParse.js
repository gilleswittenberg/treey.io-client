import { fromJS } from 'immutable'
import type { Node, NodeMap } from '../../flow/types'

const idKey = 'uid'
const nodesKey = 'nodes'

function toJS (im: ?NodeMap) {
  return im ? im.toJS() : {}
}

const TreeParse = {

  _parseNode (nodeMap: NodeMap, parentPath: string = '') {
    let map = nodeMap
    let id = map.get(idKey)
    let path = `${ parentPath }/${ id }`
    map = map.set('path', path)
    map = map.set('data', { title: nodeMap.get('title') })
    map = map.remove('title')
    const nodes: any = map.get(nodesKey)
    if (nodes) {
      const nodesList = nodes.map(node => this._parseNode.bind(this)(node, path))
      map = map.set(nodesKey, nodesList)
    }
    const ui = { expanded: false, active: false, dragging: false, hasButtonsShown: false, editing: false, movingChild: false }
    map = map.set('ui', ui)
    return map
  },

  parse (treeData: Node) {
    let tree = fromJS(treeData)
    tree = this._parseNode(tree)
    return toJS(tree)
  }
}

export default TreeParse

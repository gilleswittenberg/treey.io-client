/* @flow */

import type { NodeId, TreePath, Node } from '../../flow/tree'
import type { UIState, NodesActionsInterface, UIActionsInterface } from '../../flow/types'

import React, { Component } from 'react'
import NodeWrap from './NodeWrap'
import NodeAdd from './NodeAdd'
import NodeOver from './NodeOver'
import arraysEqual from '../lib/utils/arraysEqual'

type Props = {
  enableDnD: boolean,
  parent: ?NodeId,
  treePath: TreePath,
  ui: UIState,
  nodes: NodeId[],
  nodesArray: Node[],
  hasNodes: boolean
}
& NodesActionsInterface
& UIActionsInterface

export default class Nodes extends Component<Props> {

  static defaultProps = {
    enableDnD: false,
    parent: null,
    ui: {},
    nodes: [],
    hasNodes: false
  }

  isRoot () : bool {
    return this.props.parent === null
  }

  isUI (key: string) : bool {
    const { ui, treePath } = this.props
    if (ui && ui[key]) {
      if (arraysEqual(ui[key], treePath)) {
        return true
      }
    }
    return false
  }

  render () {

    const {
      //nodesArray,
      nodes,
      hasNodes,
      treePath,
      ui
    } = this.props

    const isRoot = this.isRoot()
    const hasNodeAdd = !isRoot
    const isAdding = this.isUI('adding')
    const isMovingChild = this.isUI('movingChild')

    const showNodeMoveChild = !hasNodes && isMovingChild
    const showNodeAdd = hasNodeAdd && !isMovingChild

    const nodeWrapProps = { ...this.props, isRoot }
    const nodeAddProps = { ...this.props, isEditing: isAdding }
    // @TODO: Display non findable nodes in UI
    // @TODO: Use map, filter (this throws in Flow)
    /*
    const nodesPopulated = []
    nodes.forEach(nodeId => {
      const node = nodesArray.find(n => n.uuid === nodeId)
      if (node == null) return
      nodesPopulated.push(node)
    })
    */

    return (
      <ul>
        { nodes.map((node, index) => {
          const id = node.ids[0]
          return (
            <li key={ id }>
              <NodeWrap
                { ...nodeWrapProps }
                uuid={ id }
                data={ node.data }
                ui={ ui }
                nodes={ node.links }
                siblings={ nodes }
                index={ index }
                treePath={ id != null ? treePath.concat([id]) : treePath }
              />
            </li>
          )
        }) }

        { showNodeAdd &&
          <li>
            <NodeAdd { ...nodeAddProps } />
          </li>
        }

        { showNodeMoveChild &&
          <li>
            <NodeOver position="child" />
          </li>
        }

      </ul>
    )
  }
}

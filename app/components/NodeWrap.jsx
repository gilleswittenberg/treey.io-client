/* @flow */
import type { NodeId, NodeData, Node, TreePath } from '../../flow/tree'
import type { UIState, NodesActionsInterface, UIActionsInterface } from '../../flow/types'

import React, { Component } from 'react'
import classNames from 'classnames'
import NodeDroppable from '../components/NodeDroppable'
import NodeEdit from '../components/NodeEdit'
import Nodes from '../components/Nodes'
import arraysEqual from '../lib/utils/arraysEqual'

type Props = {
  enableDnD: boolean,
  uuid: NodeId,
  data: NodeData,
  parent: ?NodeId,
  isRoot: boolean,
  treePath: TreePath,
  nodes: NodeId[],
  siblings: NodeId[],
  index: number,
  nodesArray: Node[],
  ui: UIState
}
& NodesActionsInterface
& UIActionsInterface

type State = {
  isOverPosition: number
}

export default class NodeWrap extends Component<Props, State> {

  static defaultProps = {
    enableDnD: false,
    parent: null,
    nodes: []
  }

  state = {
    isOverPosition: -1
  }

  isExpanded () : bool {
    const { treePath, ui: { expanded } } = this.props
    let isExpanded = false
    Object.keys(expanded).forEach(key => {
      if (arraysEqual(expanded[key], treePath)) {
        isExpanded = true
      }
    })
    return isExpanded
  }

  hasNodes () : bool {
    const { nodes } = this.props
    return Array.isArray(nodes) && nodes.length > 0
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
      enableDnD,
      uuid,
      treePath,
      isRoot
    } = this.props


    const isActive = this.isUI('active')
    const isEditing = this.isUI('editing')
    const isMovingChild = this.isUI('movingChild')
    const isAdding = this.isUI('adding')
    const isDragging = this.isUI('dragging')
    const isExpanded = this.isExpanded()
    const hasNodes = this.hasNodes()

    const className = classNames(
      'node',
      {
        '-is-root': isRoot,
        '-is-active': isActive,
        '-is-dragging': isDragging,
        '-is-expanded': (isExpanded && hasNodes) || isAdding || isMovingChild // eslint-disable-line no-extra-parens
      }
    )

    const showNodeDroppable = !isEditing
    const showNodeEdit = isEditing

    // $FlowIssue Flow does not recognize NodeDroppable.DecoratedComponent
    const NodeDroppableComponent = enableDnD ? NodeDroppable : NodeDroppable.DecoratedComponent

    const nodeDroppableProps = { ...this.props, hasNodes }
    const nodeEditProps = { ...this.props }
    // @TODO: Clean up
    nodeEditProps.title = nodeEditProps.data.title
    const nodesProps = { ...this.props, parent: uuid, hasNodes }

    const treePathString = treePath.join('/')

    return (
      <div data-tree-path={ treePathString }>
        <div className={ className }>
          { showNodeDroppable &&
            <NodeDroppableComponent { ...nodeDroppableProps } />
          }
          { showNodeEdit &&
            <NodeEdit { ...nodeEditProps } />
          }
        </div>
        <Nodes { ...nodesProps } />
      </div>
    )
  }
}

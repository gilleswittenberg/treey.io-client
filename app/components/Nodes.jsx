/* @flow */

import React, { Component, PropTypes } from 'react'
import NodeWrap from './NodeWrap'
import NodeAdd from './NodeAdd'
import NodeOver from './NodeOver'
import { isEditing, isMovingChild } from '../reducers/ui'

export default class Nodes extends Component {

  static propTypes = {
    enableDnD: PropTypes.bool,
    parent: PropTypes.string,
    nodes: PropTypes.array,
    hasNodes: PropTypes.bool
  }

  static defaultProps = {
    enableDnD: false,
    parent: null,
    nodes: [],
    hasNodes: false
  }

  isRoot () : bool {
    return this.props.parent === null
  }

  isAdding () : bool {
    const { ui, parent } = this.props
    return isEditing(ui, parent, 'add')
  }

  isMovingChild () : bool {
    const { ui, parent } = this.props
    return isMovingChild(ui, parent)
  }

  render () {

    const {
      nodes,
      hasNodes
    } = this.props

    const isRoot = this.isRoot()
    const hasNodeAdd = !isRoot
    const isAdding = this.isAdding()

    const isMovingChild = this.isMovingChild()
    const showNodeMoveChild = !hasNodes && isMovingChild
    const showNodeAdd = hasNodeAdd && !isMovingChild

    const nodeWrapProps = { ...this.props, isRoot }
    const nodeAddProps = { ...this.props, isEditing: isAdding }

    return (
      <ul>

        { nodes.map((node, index) =>
          <li key={ node.uid }>
            <NodeWrap
              { ...nodeWrapProps }
              uid={ node.uid }
              data={ node.data }
              nodeUi={ node.nodeUi }
              nodes={ node.nodes }
              siblings={ nodes }
              index={ index }
            />
          </li>
        ) }

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

/* @flow */

import React, { Component, PropTypes } from 'react'
import NodeWrap from './NodeWrap'
import NodeAdd from './NodeAdd'
import NodeOver from './NodeOver'
import { isMovingChild } from '../reducers/ui'

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

  isMovingChild () : bool {
    const { ui, parent } = this.props
    return isMovingChild(ui, parent)
  }

  render () {

    const {
      nodes,
      hasNodes,
      nodeUi
    } = this.props

    const isRoot = this.isRoot()
    const hasNodeAdd = !isRoot
    const isAdding = nodeUi && nodeUi.adding === true

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
              path={ node.path }
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

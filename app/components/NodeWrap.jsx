/* @flow */

import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import NodeDroppable from '../components/NodeDroppable'
import NodeEdit from '../components/NodeEdit'
import Nodes from '../components/Nodes'

export default class NodeWrap extends Component {

  static propTypes = {
    enableDnD: PropTypes.bool,
    app: PropTypes.object.isRequired,
    ui: PropTypes.object.isRequired,
    parent: PropTypes.string,
    isRoot: PropTypes.bool.isRequired,
    path: PropTypes.array.isRequired,
    uid: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    nodes: PropTypes.array,
    siblings: PropTypes.array.isRequired,
    index: PropTypes.number.isRequired
  }

  static defaultProps = {
    enableDnD: false,
    parent: null,
    title: '',
    nodes: []
  }

  state = {
    isOverPosition: -1
  }

  hasNodes () : bool {
    const { nodes } = this.props
    return Array.isArray(nodes) && nodes.length > 0
  }

  render () {

    const {
      enableDnD,
      uid,
      ui
    } = this.props

    const isActive = ui ? ui.active : false
    const isEditing = ui ? ui.editing : false
    const isMovingChild = ui ? ui.movingChild : false
    const isAdding = ui ? ui.adding : false
    const isDragging = ui ? ui.dragging : false
    const isExpanded = ui ? ui.expanded : false
    const hasNodes = this.hasNodes()

    const className = classNames(
      'node',
      {
        '-is-active': isActive,
        '-is-dragging': isDragging,
        '-is-expanded': (isExpanded && hasNodes) || isAdding || isMovingChild
      }
    )

    const showNodeDroppable = !isEditing
    const showNodeEdit = isEditing

    // $FlowIssue Flow does not recognize NodeDroppable.DecoratedComponent
    const NodeDroppableComponent = enableDnD ? NodeDroppable : NodeDroppable.DecoratedComponent

    const nodeDroppableProps = { ...this.props, hasNodes }
    const nodeEditProps = { ...this.props }
    nodeEditProps.title = nodeEditProps.data.title
    const nodesProps = { ...this.props, parent: uid, hasNodes }

    return (
      <div>
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

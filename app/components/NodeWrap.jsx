/* @flow */

import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import NodeDroppable from '../components/NodeDroppable'
import NodeEdit from '../components/NodeEdit'
import Nodes from '../components/Nodes'
import {
  isEditing as isEditingFunc,
  isDragging as isDraggingFunc,
  isExpanded as isExpandedFunc
} from '../reducers/ui'

export default class NodeWrap extends Component {

  static propTypes = {
    enableDnD: PropTypes.bool,
    ui: PropTypes.object.isRequired,
    parent: PropTypes.string,
    isRoot: PropTypes.bool.isRequired,
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

  isEditing () : bool {
    const { ui, uid } = this.props
    return isEditingFunc(ui, uid)
  }

  isAdding () : bool {
    const { ui, uid } = this.props
    return isEditingFunc(ui, uid, 'add')
  }

  isDragging () : bool {
    const { ui, uid } = this.props
    return isDraggingFunc(ui, uid)
  }

  isExpanded () : bool {
    const { ui, uid } = this.props
    return uid !== null && isExpandedFunc(ui, uid)
  }

  hasNodes () : bool {
    const { nodes } = this.props
    return Array.isArray(nodes) && nodes.length > 0
  }

  render () {

    const {
      enableDnD,
      uid
    } = this.props

    const isEditing = this.isEditing()
    const isAdding = this.isAdding()
    const isDragging = this.isDragging()
    const isExpanded = this.isExpanded()
    const hasNodes = this.hasNodes()

    const className = classNames(
      'node',
      {
        '-is-dragging': isDragging,
        '-is-expanded': (isExpanded && hasNodes) || isAdding
      }
    )

    const showNodeDroppable = !isEditing
    const showNodeEdit = isEditing

    // $FlowIssue Flow does not recognize NodeDroppable.DecoratedComponent
    const NodeDroppableComponent = enableDnD ? NodeDroppable : NodeDroppable.DecoratedComponent

    const nodeDroppableProps = { ...this.props, hasNodes }
    const nodeEditProps = { ...this.props }
    const nodesProps = { ...this.props, parent: uid }

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

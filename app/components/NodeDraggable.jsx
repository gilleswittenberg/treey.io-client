/* @flow */

import React, { Component, PropTypes } from 'react'
import NodeContent from '../components/NodeContent'
import DND_TYPE from '../settings/DND_TYPE'
import { DragSource } from 'react-dnd'

const DragSpec = {
  canDrag (props) {
    return !props.isRoot
  },
  beginDrag (props) {
    const { treePath, clearUIEditingAdding, setUIActive, setUIDragging } = props
    clearUIEditingAdding()
    setUIActive(treePath)
    setUIDragging(treePath)
    return props
  },
  endDrag (props) {
    const { clearUIDragging } = props
    clearUIDragging()
    return props
  }
}

export class NodeDraggable extends Component {

  static propTypes = {
    isRoot: PropTypes.bool.isRequired,
    treePath: PropTypes.array.isRequired,
    uuid: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    clearUIEditingAdding: PropTypes.func.isRequired,
    setUIActive: PropTypes.func.isRequired,
    setUIDragging: PropTypes.func.isRequired,
    clearUIDragging: PropTypes.func.isRequired,
    // Injected by React DnD DragSource
    connectDragSource: PropTypes.func,
    isDragging: PropTypes.bool,
    connectDragPreview: React.PropTypes.func
  }

  static defaultProps = {
    connectDragSource: (jsx: any) => jsx
  }

  render () {

    const { data: { title }, connectDragSource } = this.props
    const nodeContentProps = { ...this.props, title }

    return (
      connectDragSource(
        <div className="node-draggable">
          <NodeContent { ...nodeContentProps } />
        </div>
      )
    )
  }
}

@DragSource(DND_TYPE, DragSpec, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
  connectDragPreview: connect.dragPreview()
}))
export default class NodeDraggableDecorated extends NodeDraggable {}

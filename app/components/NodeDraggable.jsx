/* @flow */
import type { NodeId, TreePath } from '../../flow/tree'

import React, { Component } from 'react'
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

type Props = {
  isRoot: boolean,
  treePath: TreePath,
  uuid: NodeId,
  data: any,
  clearUIEditingAdding: any,
  setUIActive: any,
  setUIDragging: any,
  setUIEditing: any,
  clearUIDragging: any,
  handleClick: any,
  handleClickMore: any,
  connectDragSource: any,
  isDragging?: boolean,
  connectDragPreview?: any
}

export class NodeDraggable extends Component<Props> {

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

@DragSource(DND_TYPE, DragSpec, (connect, monitor) => ({ // eslint-disable-line new-cap
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
  connectDragPreview: connect.dragPreview()
}))
export default class NodeDraggableDecorated extends NodeDraggable {}

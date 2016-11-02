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
    const { uid, unsetIsEditing, setIsDragging } = props
    unsetIsEditing()
    setIsDragging(uid)
    return props
  },
  endDrag (props) {
    const { uid, unsetIsDragging } = props
    unsetIsDragging(uid)
    return props
  }
}

export class NodeDraggable extends Component {

  static propTypes = {
    lang: PropTypes.string,
    parent: PropTypes.string,
    isRoot: PropTypes.bool.isRequired,
    uid: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    unsetIsEditing: PropTypes.func.isRequired,
    setIsDragging: PropTypes.func.isRequired,
    unsetIsDragging: PropTypes.func.isRequired,
    // Injected by React DnD DragSource
    connectDragSource: PropTypes.func,
    isDragging: PropTypes.bool,
    connectDragPreview: React.PropTypes.func
  }

  static defaultProps = {
    connectDragSource: (jsx: any) => jsx
  }

  render () {

    const {
      lang,
      title,
      handleClick,
      handleClickMore,
      connectDragSource
    } = this.props

    const nodeContentProps = { lang, title, handleClick, handleClickMore }

    return (
      connectDragSource(
        <div>
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

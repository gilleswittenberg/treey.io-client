/* @flow */

import React, { Component, PropTypes } from 'react'
import NodeBody from '../components/NodeBody'
import DND_TYPE from '../settings/DND_TYPE'
import { DragSource } from 'react-dnd'
import classNames from 'classnames'

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

@DragSource(DND_TYPE, DragSpec, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
  connectDragPreview: connect.dragPreview()
}))
export default class NodeDraggable extends Component {

  static propTypes = {
    ui: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    parent: PropTypes.string,
    isRoot: PropTypes.bool.isRequired,
    uid: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    hasNodes: PropTypes.bool.isRequired,
    unsetIsEditing: PropTypes.func.isRequired,
    setIsDragging: PropTypes.func.isRequired,
    unsetIsDragging: PropTypes.func.isRequired,
    // Injected by React DnD DragSource
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    connectDragPreview: React.PropTypes.func.isRequired
  }

  render () {

    const {
      ui,
      ui: { lang },
      parent,
      isRoot,
      uid,
      title,
      hasNodes,
      isDragging,
      actions: { setIsEditing, unsetIsEditing, setShowButtons, toggleExpanded, deleteNode },
      connectDragSource
    } = this.props

    const className = classNames({ '-is-dragging': isDragging })

    return (
      connectDragSource(
        <div className={ className }>
          <NodeBody
            ui={ ui }
            lang={ lang }
            parent={ parent }
            isRoot={ isRoot }
            uid={ uid }
            title={ title }
            hasNodes={ hasNodes }
            unsetIsEditing={ unsetIsEditing }
            setIsEditing={ setIsEditing }
            toggleExpanded={ toggleExpanded }
            deleteNode={ deleteNode }
            setShowButtons={ setShowButtons }
          />
        </div>
      )
    )
  }
}

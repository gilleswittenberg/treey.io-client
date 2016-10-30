/* @flow */

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import NodeDraggable from '../components/NodeDraggable'
import NodeOver from '../components/NodeOver'
import DnDType from '../settings/DND_TYPE'
import { DropTarget } from 'react-dnd'

function getOverMousePosition (monitor, element) {
  const height = 34 // 32 height + 2 margin
  const yDrag = monitor.getClientOffset().y
  const yDrop = element.getBoundingClientRect().top
  const isOverPosition = yDrag - yDrop < height / 2 ? 'top' : 'bottom'
  return isOverPosition
}

const DropSpec = {

  canDrop (props) {
    return !props.isRoot
  },

  hover (props, monitor, component) {

    // guard: do not allow dropping as sibling of root
    if (props.isRoot) return

    const overPosition = getOverMousePosition (monitor, component.element)
    component.setState({ isOverPosition: overPosition })
  },

  drop (props, monitor, component) {

    const item = monitor.getItem()
    const { parent, uid } = item
    const { parent: newParent } = props
    const overPosition = getOverMousePosition(monitor, component.element)
    const before = overPosition === 'top' ? props.uid : props.after

    // guard: do not save when node is dropped on original location
    if (before === item.after) return

    // save
    const { putMoveNode } = item
    putMoveNode(parent, uid, newParent, before)
  }
}

@DropTarget(DnDType, DropSpec, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  isOverItemUid: monitor.getItem() ? monitor.getItem().uid : null,
  canDrop: monitor.canDrop()
}))
export class NodeDroppable extends Component {

  static propTypes = {
    lang: PropTypes.string,
    parent: PropTypes.string,
    isRoot: PropTypes.bool.isRequired,
    uid: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    hasNodes: PropTypes.bool.isRequired,
    after: PropTypes.string,
    setIsEditing: PropTypes.func.isRequired,
    unsetIsEditing: PropTypes.func.isRequired,
    setIsDragging: PropTypes.func.isRequired,
    unsetIsDragging: PropTypes.func.isRequired,
    setShowButtons: PropTypes.func.isRequired,
    toggleExpanded: PropTypes.func.isRequired,
    deleteNode: PropTypes.func.isRequired,
    putMoveNode: PropTypes.func.isRequired,
    // Injected by React DnD DropTarget
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    isOverItemUid: PropTypes.string,
    canDrop: PropTypes.bool.isRequired
  }

  state = {
    isOverPosition: -1
  }

  element = undefined

  render () {

    const {
      parent,
      isRoot,
      uid,
      title,
      hasNodes,
      after,
      setIsEditing,
      unsetIsEditing,
      setIsDragging,
      unsetIsDragging,
      setShowButtons,
      toggleExpanded,
      deleteNode,
      putMoveNode,
      connectDropTarget,
      isOver,
      isOverItemUid
    } = this.props
    const { isOverPosition } = this.state

    const isOverOther = isOver && isOverItemUid !== uid
    const showNodeOverTop = isOverOther && isOverPosition === 'top'
    const showNodeOverBottom = isOverOther && isOverPosition === 'bottom'

    return (
      connectDropTarget(
        <div ref={ c => this.element = c }>
          { showNodeOverTop &&
            <NodeOver position="top" />
          }
          <NodeDraggable
            parent={ parent }
            uid={ uid }
            title={ title }
            after={ after }
            showAddButton={ !hasNodes }
            showDeleteButton={ !isRoot }
            setIsEditing={ setIsEditing }
            unsetIsEditing={ unsetIsEditing }
            setIsDragging={ setIsDragging }
            unsetIsDragging={ unsetIsDragging }
            toggleExpanded={ toggleExpanded }
            deleteNode={ deleteNode }
            allowExpanding={ hasNodes }
            setShowButtons={ setShowButtons }
            putMoveNode={ putMoveNode }
          />
          { showNodeOverBottom &&
            <NodeOver position="bottom" />
          }
        </div>
      )
    )
  }
}

export default connect()(NodeDroppable)

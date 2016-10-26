/* @flow */

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import NodeBody from '../components/NodeBody'
import NodeEdit from '../components/NodeEdit'
import NodeOver from '../components/NodeOver'
import Nodes from '../components/Nodes'
import { DragSource, DropTarget } from 'react-dnd'
import {
  isEditing as isEditingFunc,
  hasButtonsShown as hasButtonsShownFunc,
  isExpanded as isExpandedFunc
} from '../reducers/ui'

function getOverMousePosition (monitor, element) {
  const height = 34 // 32 height + 2 margin
  const yDrag = monitor.getClientOffset().y
  const yDrop = element.getBoundingClientRect().top
  const isOverPosition = yDrag - yDrop < height / 2 ? 'top' : 'bottom'
  return isOverPosition
}

const DnDType = 'node'
const DragSpec = {
  beginDrag (props) {
    props.unsetIsEditing()
    return props
  },
  canDrag (props) {
    return !props.isRoot
  }
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

@DragSource(DnDType, DragSpec, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
  connectDragPreview: connect.dragPreview()
}))
@DropTarget(DnDType, DropSpec, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  isOverItemUid: monitor.getItem() ? monitor.getItem().uid : null,
  canDrop: monitor.canDrop()
}))
export class NodeWrap extends Component {

  static propTypes = {
    parent: PropTypes.string,
    isRoot: PropTypes.bool.isRequired,
    uid: PropTypes.string.isRequired,
    after: PropTypes.string,
    title: PropTypes.string.isRequired,
    nodes: PropTypes.array,
    hasNodes: PropTypes.bool.isRequired,
    ui: PropTypes.object.isRequired,
    isEditing: PropTypes.bool.isRequired,
    setIsEditing: PropTypes.func.isRequired,
    unsetIsEditing: PropTypes.func.isRequired,
    setShowButtons: PropTypes.func.isRequired,
    expand: PropTypes.func.isRequired,
    toggleExpanded: PropTypes.func.isRequired,
    postNode: PropTypes.func.isRequired,
    putNode: PropTypes.func.isRequired,
    deleteNode: PropTypes.func.isRequired,
    putMoveNode: PropTypes.func.isRequired,
    // Injected by React DnD DragSource
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    connectDragPreview: React.PropTypes.func.isRequired,
    // Injected by React DnD DropTarget
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    isOverItemUid: PropTypes.string,
    canDrop: PropTypes.bool.isRequired
  }

  state = {
    isDragging: false,
    isOverPosition: -1
  }

  element = undefined

  render () {

    const {
      parent,
      isRoot,
      uid,
      title,
      nodes,
      hasNodes,
      ui,
      setIsEditing,
      unsetIsEditing,
      setShowButtons,
      expand,
      toggleExpanded,
      isEditing,
      postNode,
      putNode,
      deleteNode,
      putMoveNode,
      connectDragSource,
      isDragging,
      connectDropTarget,
      isOver,
      isOverItemUid
    } = this.props
    const {
      isOverPosition
    } = this.state
    const isExpanded = isExpandedFunc(ui, uid)
    const isAdding = isEditingFunc(ui, uid, 'add')
    const hasButtonsShown = hasButtonsShownFunc(ui, uid)
    const isOverOther = isOver && isOverItemUid !== uid

    const className = classNames(
      'node',
      {
        '-is-editing': isEditing,
        '-is-expanded': (isExpanded && hasNodes) || isAdding,
        '-is-dragging': isDragging,
        '-has-buttons-shown': hasButtonsShown
      }
    )

    const showNodeOverTop = !isEditing && isOverOther && isOverPosition === 'top'
    const showNodeBody = !isEditing
    const showNodeOverBottom = !isEditing && isOverOther && isOverPosition === 'bottom'
    const showNodeEdit = isEditing

    return (
      <div ref={ c => this.element = c }>

        { connectDropTarget(connectDragSource(
          <div className={ className }>
            { showNodeOverTop &&
              <NodeOver position="top" />
            }
            { showNodeBody &&
              <NodeBody
                parent={ parent }
                uid={ uid }
                title={ title }
                showAddButton={ hasNodes }
                showDeleteButton={ !isRoot }
                unsetIsEditing={ unsetIsEditing }
                setIsEditing={ setIsEditing }
                toggleExpanded={ toggleExpanded }
                deleteNode={ deleteNode }
                allowExpanding={ hasNodes }
                setShowButtons={ setShowButtons }
              />
            }
            { showNodeOverBottom &&
              <NodeOver position="bottom" />
            }
            { showNodeEdit &&
              <NodeEdit
                parent={ parent }
                uid={ uid }
                title={ title }
                unsetIsEditing={ unsetIsEditing }
                putNode={ putNode }
                deleteNode={ deleteNode }
              />
            }
          </div>
        )) }

        <Nodes
          parent={ uid }
          nodes={ nodes }
          ui={ ui }
          setIsEditing={ setIsEditing }
          unsetIsEditing={ unsetIsEditing }
          setShowButtons={ setShowButtons }
          expand={ expand }
          toggleExpanded={ toggleExpanded }
          deleteNode={ deleteNode }
          postNode={ postNode }
          putNode={ putNode }
          putMoveNode={ putMoveNode }
        />
      </div>
    )
  }
}

export default connect((state, props) => ({
  parent: props.parent,
  isRoot: props.parent === null,
  uid: props.uid,
  title: props.title || '',
  nodes: props.nodes || [],
  hasNodes: !!(props.nodes && props.nodes.length),
  ui: props.ui,
  isEditing: props.isEditing,
  setIsEditing: props.setIsEditing,
  unsetIsEditing: props.unsetIsEditing,
  expand: props.expand,
  toggleExpanded: props.toggleExpanded,
  postNode: props.postNode,
  putNode: props.putNode,
  deleteNode: props.deleteNode,
  putMoveNode: props.putMoveNode
}))(NodeWrap)

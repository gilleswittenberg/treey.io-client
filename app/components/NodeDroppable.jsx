/* @flow */

import React, { Component, PropTypes } from 'react'
import NodeBody from '../components/NodeBody'
import NodeOver from '../components/NodeOver'
import DND_TYPE from '../settings/DND_TYPE'
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

    const item = monitor.getItem() // NodeDraggable props
    const { parent, uid } = item
    const { parent: newParent } = props // NodeDroppable props
    const overPosition = getOverMousePosition(monitor, component.element)
    const nextSiblingDroppable = component.getNextSibling() // next uid: ?string after NodeDroppable
    const before = overPosition === 'top' ? props.uid : nextSiblingDroppable

    // const nextSiblingDraggable = item.nextSibling // next uid: ?string after NodeDraggable
    // guard: do not save when node is dropped on original location
    // @TODO: fix nextSiblingDraggable
    // if (before && before === nextSiblingDraggable) return

    // save
    const { putMoveNode } = props
    putMoveNode(parent, uid, newParent, before)
  }
}

@DropTarget(DND_TYPE, DropSpec, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  isOverItemUid: monitor.getItem() ? monitor.getItem().uid : null,
  canDrop: monitor.canDrop()
}))
export default class NodeDroppable extends Component {

  static propTypes = {
    ui: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    parent: PropTypes.string,
    uid: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    hasNodes: PropTypes.bool.isRequired,
    siblings: PropTypes.array.isRequired,
    index: PropTypes.number.isRequired,
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

  getNextSibling () : ?string {
    const { siblings, index } = this.props
    const nextNode = siblings[index + 1]
    if (!nextNode) return null
    return nextNode.uid
  }

  isOverOther () : bool {
    const { isOver, isOverItemUid, uid } = this.props
    return isOver && isOverItemUid !== uid
  }

  showNodeOverTop () : bool {
    const isOverOther = this.isOverOther()
    const { isOverPosition } = this.state
    return isOverOther && isOverPosition === 'top'
  }

  showNodeOverBottom () : bool {
    const isOverOther = this.isOverOther()
    const { isOverPosition } = this.state
    return isOverOther && isOverPosition === 'bottom'
  }

  render () {

    const {
      actions,
      actions: {
        unsetIsEditing,
        setIsEditing,
        toggleExpanded,
        deleteNode,
        setShowButtons
      },
      ui,
      ui: { lang },
      parent,
      isRoot,
      uid,
      title,
      hasNodes,
      connectDropTarget
    } = this.props

    const showNodeOverTop = this.showNodeOverTop()
    const showNodeOverBottom = this.showNodeOverBottom()

    return (
      connectDropTarget(
        <div ref={ c => this.element = c }>
          { showNodeOverTop &&
            <NodeOver position="top" />
          }
          <NodeBody
            ui={ ui }
            actions={ actions }
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
          { showNodeOverBottom &&
            <NodeOver position="bottom" />
          }
        </div>
      )
    )
  }
}

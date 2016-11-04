/* @flow */

import React, { Component, PropTypes } from 'react'
import Node from '../components/Node'
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

class NodeDroppable extends Component {

  static propTypes = {
    parent: PropTypes.string,
    uid: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    hasNodes: PropTypes.bool.isRequired,
    siblings: PropTypes.array.isRequired,
    index: PropTypes.number.isRequired,
    putMoveNode: PropTypes.func.isRequired,
    // Injected by React DnD DropTarget
    connectDropTarget: PropTypes.func,
    isOver: PropTypes.bool,
    isOverItemUid: PropTypes.string
  }

  static defaultProps = {
    connectDropTarget: (jsx: any) => jsx
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
      connectDropTarget
    } = this.props

    const showNodeOverTop = this.showNodeOverTop()
    const showNodeOverBottom = this.showNodeOverBottom()

    const nodeProps = { ...this.props }

    return (
      connectDropTarget(
        <div ref={ c => this.element = c }>
          { showNodeOverTop &&
            <NodeOver position="top" />
          }
          <Node { ...nodeProps } />
          { showNodeOverBottom &&
            <NodeOver position="bottom" />
          }
        </div>
      )
    )
  }
}

@DropTarget(DND_TYPE, DropSpec, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  isOverItemUid: monitor.getItem() ? monitor.getItem().uid : null
}))
export default class NodeDroppableDecorated extends NodeDroppable {}

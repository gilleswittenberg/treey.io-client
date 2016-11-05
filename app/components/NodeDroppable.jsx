/* @flow */

import React, { Component, PropTypes } from 'react'
import Node from '../components/Node'
import NodeOver from '../components/NodeOver'
import DND_TYPE from '../settings/DND_TYPE'
import { DropTarget } from 'react-dnd'
import getOverMousePosition from '../lib/getOverMousePosition'
import getNextSibling from '../lib/getNextSibling'

const DropSpec = {

  canDrop (props) {
    return !props.isRoot
  },

  hover (props, monitor, component) {

    // guard: do not allow dropping as sibling of root
    if (!this.canDrop(props)) return

    const overPosition = component.getOverMousePosition (monitor, component.element)
    component.setState({ isOverPosition: overPosition })
  },

  drop (props, monitor, component) {

    const item = monitor.getItem() // NodeDraggable props
    const {
      parent: parentDraggable,
      uid: uidDraggable,
      siblings: siblingsDraggable,
      index: indexDraggable
    } = item
    const { parent, uid, siblings, index } = props // NodeDroppable props
    const overPosition = component.getOverMousePosition(monitor, component.element)
    const nextSiblingDroppable = getNextSibling(siblings, index) // next uid: ?string after NodeDroppable
    const nextSiblingDraggable = getNextSibling(siblingsDraggable, indexDraggable) // next uid: ?string after NodeDraggable
    const before = overPosition === 'top' ? uid : nextSiblingDroppable
    // guard: do not put when dropped on original position
    if (overPosition === 'top' && before === nextSiblingDraggable) return
    if (overPosition === 'bottom' && before === uidDraggable) return

    // save
    const { putMoveNode } = props
    putMoveNode(parentDraggable, uidDraggable, parent, before)
  }
}

class NodeDroppable extends Component {

  static propTypes = {
    parent: PropTypes.string,
    isRoot: PropTypes.bool.isRequired,
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

  isOverOther () : bool {
    const { isOver, isOverItemUid, uid } = this.props
    return isOver && isOverItemUid !== uid
  }

  // Added as method to component to dependency inject getOverMousePosition.
  // Another way would be to mock the es6 module import of getOverMousePosition
  // But this is hard / impossible with Jest
  // @TODO: Try to make mocking es6 default export work in Jest. And remove.
  getOverMousePosition (monitor, element) : string {
    const { overMousePosition } = this.props
    if (overMousePosition) return overMousePosition
    return getOverMousePosition(monitor, element)
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

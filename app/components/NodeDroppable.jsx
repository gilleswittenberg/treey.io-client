/* @flow */

import React, { Component, PropTypes } from 'react'
import Node from './Node'
import NodeOver from './NodeOver'
import DND_TYPE from '../settings/DND_TYPE'
import { DropTarget } from 'react-dnd'
import getHoverRegion from '../lib/getHoverRegion'
import getNextSibling from '../lib/getNextSibling'

const DropSpec = {

  canDrop (props) {
    return !props.isRoot
  },

  hover (props, monitor, component) {

    // guard: do not allow hover on self
    if (props.uid === monitor.getItem().uid) return false

    // guard: do not allow dropping as sibling of root
    if (!monitor.canDrop()) return false

    const hoverRegion = component.getHoverRegion(monitor, component.element)
    component.setState({ hoverRegion })
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
    const overPosition = component.getHoverRegion(monitor, component.element)
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
    path: PropTypes.array.isRequired,
    hasNodes: PropTypes.bool.isRequired,
    siblings: PropTypes.array.isRequired,
    index: PropTypes.number.isRequired,
    putMoveNode: PropTypes.func.isRequired,
    // Injected by React DnD DropTarget
    connectDropTarget: PropTypes.func,
    isOver: PropTypes.bool
  }

  static defaultProps = {
    connectDropTarget: (jsx: any) => jsx
  }

  state = {
    hoverRegion: null
  }

  element = undefined

  // logic for hover out
  componentWillReceiveProps (nextProps: any) {
    const { isOver } = this.props
    if (nextProps.isOver === false && isOver === true) {
      this.setState({ hoverRegion: null })
    }
  }

  getHoverRegion (monitor, element) : string {

    // used when mocking
    // @TODO: Try to make mocking es6 default export work in Jest. And remove.
    const { hoverRegion: hoverRegionProps } = this.props
    if (hoverRegionProps) return hoverRegionProps

    // first time hover
    const { hoverRegion: hoverRegionState } = this.state
    if (hoverRegionState === null) return 'top'

    // succeeding hover events
    return getHoverRegion(monitor, element, hoverRegionState)
  }

  showNodeOverTop () : bool {
    const { isOver } = this.props
    const { hoverRegion } = this.state
    return isOver && hoverRegion === 'top'
  }

  showNodeOverBottom () : bool {
    const { isOver } = this.props
    const { hoverRegion } = this.state
    return isOver && hoverRegion === 'bottom'
  }

  render () {

    const {
      ui,
      connectDropTarget
    } = this.props

    const isMovingChild = ui && ui.movingChild === true
    const showNodeOverTop = this.showNodeOverTop() && !isMovingChild
    const showNodeOverBottom = this.showNodeOverBottom() && !isMovingChild

    const nodeProps = { ...this.props }

    return (
      connectDropTarget(
        <div ref={ c => this.element = c }>
          { showNodeOverTop &&
            <NodeOver position="above" />
          }
          <Node { ...nodeProps } />
          { showNodeOverBottom &&
            <NodeOver position="below" />
          }
        </div>
      )
    )
  }
}

@DropTarget(DND_TYPE, DropSpec, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver({ shallow: true })
}))
export default class NodeDroppableDecorated extends NodeDroppable {}

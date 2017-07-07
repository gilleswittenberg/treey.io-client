/* @flow */

import React, { Component, PropTypes } from 'react'
import Node from './Node'
import NodeOver from './NodeOver'
import DND_TYPE from '../settings/DND_TYPE'
import { DropTarget } from 'react-dnd'
import getHoverRegion from '../lib/ui/getHoverRegion'
import getNextSibling from '../lib/ui/getNextSibling'

const DropSpec = {

  canDrop (props) {
    return !props.isRoot
  },

  hover (props, monitor, component) {

    // Guard: do not allow hover on self
    if (props.uuid === monitor.getItem().uuid) return false

    // Guard: do not allow dropping as sibling of root
    if (!monitor.canDrop()) return false

    const hoverRegion = component.getHoverRegion(monitor, component.element)
    component.setState({ hoverRegion })
  },

  drop (props, monitor, component) {

    const item = monitor.getItem() // NodeDraggable props
    const {
      treePath,
      uuid: uuidDraggable,
      siblings: siblingsDraggable,
      index: indexDraggable
    } = item

    const { treePath: pathDroppable, uuid, siblings, index, move } = props // NodeDroppable props
    const overPosition = component.getHoverRegion(monitor, component.element)
    const nextSiblingDroppable = getNextSibling(siblings, index) // Next uuid: ?string after NodeDroppable
    const nextSiblingDraggable = getNextSibling(siblingsDraggable, indexDraggable) // Next uuid: ?string after NodeDraggable
    const before = overPosition === 'top' ? uuid : nextSiblingDroppable

    // Guard: do not put when dropped on original position
    if (overPosition === 'top' && before === nextSiblingDraggable) return
    if (overPosition === 'bottom' && before === uuidDraggable) return

    const newPath = pathDroppable && pathDroppable.length > 1 ? pathDroppable.slice(0, -1) : pathDroppable

    // Save
    move(treePath, newPath, before)
  }
}

class NodeDroppable extends Component {

  static propTypes = {
    parent: PropTypes.string,
    isRoot: PropTypes.bool.isRequired,
    uuid: PropTypes.string.isRequired,
    treePath: PropTypes.array.isRequired,
    hasNodes: PropTypes.bool.isRequired,
    siblings: PropTypes.array.isRequired,
    index: PropTypes.number.isRequired,
    move: PropTypes.func.isRequired,
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

  // Logic for hover out
  componentWillReceiveProps (nextProps: any) {
    const { isOver } = this.props
    if (nextProps.isOver === false && isOver === true) {
      this.setState({ hoverRegion: null })
    }
  }

  getHoverRegion (monitor, element) : string {

    // Used when mocking
    // @TODO: Try to make mocking es6 default export work in Jest. And remove.
    const { hoverRegion: hoverRegionProps } = this.props
    if (hoverRegionProps) return hoverRegionProps

    // First time hover
    const { hoverRegion: hoverRegionState } = this.state
    if (hoverRegionState === null) return 'top'

    // Succeeding hover events
    return getHoverRegion(monitor, element)
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
      connectDropTarget
    } = this.props
    const movingChild = false

    const showNodeOverTop = this.showNodeOverTop() && !movingChild
    const showNodeOverBottom = this.showNodeOverBottom() && !movingChild

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

/* @flow */
import type { NodeId, NodeData, TreePath, Nodes } from '../../flow/tree'
import type { UIState, NodesActionsInterface, UIActionsInterface } from '../../flow/types'

import React, { Component } from 'react'
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
    const nodeDraggableTitle = monitor.getItem().data.title
    component.setState({ hoverRegion, nodeDraggableTitle })
  },

  drop (props, monitor, component) {

    // NodeDraggable props
    const item = monitor.getItem()
    const {
      treePath,
      uuid: uuidDraggable,
      siblings: siblingsDraggable,
      index: indexDraggable
    } = item

    // NodeDroppable props
    const { treePath: pathDroppable, uuid, siblings, index, move } = props
    const overPosition = component.getHoverRegion(monitor, component.element)
    // Next uuid: ?string after NodeDroppable
    const nextSiblingDroppable = getNextSibling(siblings, index)
    // Next uuid: ?string after NodeDraggable
    const nextSiblingDraggable = getNextSibling(siblingsDraggable, indexDraggable)
    const before = overPosition === 'top' ? uuid : nextSiblingDroppable

    // Guard: do not move when dropped on original position
    if (overPosition === 'top' && before === nextSiblingDraggable) return
    if (overPosition === 'bottom' && before === uuidDraggable) return

    const newPath = pathDroppable && pathDroppable.length > 1 ? pathDroppable.slice(0, -1) : pathDroppable

    // Save
    move(treePath, newPath, before)
  }
}

type Props = {
  parent: ?NodeId,
  isRoot: boolean,
  data: NodeData,
  ui: UIState,
  uuid: NodeId,
  treePath: TreePath,
  hasNodes: boolean,
  siblings: NodeId[],
  nodesArray: Nodes,
  index: number,
  connectDropTarget: any,
  isOver: boolean,
  hoverRegion?: 'top' | 'bottom'
}
& NodesActionsInterface
& UIActionsInterface

type State = {
  hoverRegion: ?any,
  nodeDraggableTitle: ?string
}

class NodeDroppable extends Component<Props, State> {

  static defaultProps = {
    isOver: false,
    connectDropTarget: (jsx: any) => jsx
  }

  state = {
    hoverRegion: null,
    nodeDraggableTitle: null
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

  showNodeOverTop () : boolean {
    const { isOver } = this.props
    const { hoverRegion } = this.state
    return isOver && hoverRegion === 'top'
  }

  showNodeOverBottom () : boolean {
    const { isOver } = this.props
    const { hoverRegion } = this.state
    return isOver && hoverRegion === 'bottom'
  }

  render () {

    const { connectDropTarget } = this.props
    const showNodeOverTop = this.showNodeOverTop()
    const showNodeOverBottom = this.showNodeOverBottom()
    const nodeProps = this.props
    const { nodeDraggableTitle } = this.state

    return (
      connectDropTarget(
        <div ref={ c => this.element = c }>
          { showNodeOverTop &&
            <NodeOver position="above" title={ nodeDraggableTitle || '' } />
          }
          <Node { ...nodeProps } />
          { showNodeOverBottom &&
            <NodeOver position="below" title={ nodeDraggableTitle || ''} />
          }
        </div>
      )
    )
  }
}

@DropTarget(DND_TYPE, DropSpec, (connect, monitor) => ({ // eslint-disable-line new-cap
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver({ shallow: true })
}))
export default class NodeDroppableDecorated extends NodeDroppable {}

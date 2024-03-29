/* @flow */

import React, { Component } from 'react'
import { DragLayer } from 'react-dnd'

const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%'
}

function getItemStyles (props) {

  const { currentOffset } = props

  // Guard
  if (!currentOffset) return { display: 'none' }

  const { x, y } = currentOffset
  const transform = `translate(${ x }px, ${ y }px)`
  return {
    transform,
    WebkitTransform: transform
  }
}

type Props = {
  item?: any,
  itemType?: string,
  currentOffset?: {
    x: number,
    y: number
  },
  isDragging?: boolean
}

@DragLayer(monitor => ({ // eslint-disable-line new-cap
  item: monitor.getItem(),
  itemType: monitor.getItemType(),
  currentOffset: monitor.getSourceClientOffset(),
  isDragging: monitor.isDragging()
}))
export default class CustomDragLayer extends Component<Props> {

  render () {
    const { item, isDragging } = this.props

    // Guard: do not render when not dragging
    if (!isDragging || !item) return null

    const { data: { title } } = item

    return (
      <div style={ layerStyles }>
        <div style={ getItemStyles(this.props) }>
          <div className="node node-drag-layer">
            <div className="node-body">
              <div className="node-content">
                <span>{ title }</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

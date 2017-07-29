/* @flow */

import React, { Component, PropTypes } from 'react'
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

class CustomDragLayer extends Component {

  static propTypes = {
    // Injected by React DnD DragLayer
    item: PropTypes.object,
    itemType: PropTypes.string,
    currentOffset: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number
    }),
    isDragging: PropTypes.bool
  }

  render () {
    const { item, isDragging } = this.props

    // Guard: do not render when not dragging
    if (!isDragging || !item) return null

    const { data: { title } } = item

    return (
      <div style={ layerStyles }>
        <div style={ getItemStyles(this.props) }>
          <div className="node node-drag-layer">
            <div className="node-content">
              <div className="node-body">
                <span>{ title }</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

@DragLayer(monitor => ({
  item: monitor.getItem(),
  itemType: monitor.getItemType(),
  currentOffset: monitor.getSourceClientOffset(),
  isDragging: monitor.isDragging()
}))
export default class CustomDragLayerDecorated extends CustomDragLayer {}

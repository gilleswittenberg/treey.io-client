import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
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

  // guard
  if (!currentOffset) return { display: 'none' }

  const { x, y } = currentOffset
  const transform = `translate(${ x }px, ${ y }px)`
  return {
    transform,
    WebkitTransform: transform
  }
}

@DragLayer(monitor => ({
  item: monitor.getItem(),
  itemType: monitor.getItemType(),
  currentOffset: monitor.getSourceClientOffset(),
  isDragging: monitor.isDragging()
}))
class CustomDragLayer extends Component {

  static propTypes = {
    item: PropTypes.object,
    itemType: PropTypes.string,
    currentOffset: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    }),
    isDragging: PropTypes.bool.isRequired
  }

  render () {
    const { item, isDragging } = this.props

    // guard
    if (!isDragging || !item) return null

    const { title } = item

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

export default connect()(CustomDragLayer)

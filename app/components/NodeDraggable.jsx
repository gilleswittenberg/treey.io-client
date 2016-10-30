/* @flow */

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import NodeBody from '../components/NodeBody'
import DnDType from '../settings/DND_TYPE'
import DEFAULT_LANG from '../settings/DEFAULT_LANG'
import { DragSource } from 'react-dnd'
import classNames from 'classnames'

const DragSpec = {
  canDrag (props) {
    return !props.isRoot
  },
  beginDrag (props) {
    const { uid, unsetIsEditing, setIsDragging } = props
    unsetIsEditing()
    setIsDragging(uid)
    return props
  },
  endDrag (props) {
    const { uid, unsetIsDragging } = props
    unsetIsDragging(uid)
    return props
  }
}

@DragSource(DnDType, DragSpec, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
  connectDragPreview: connect.dragPreview()
}))
export class NodeDraggable extends Component {

  static propTypes = {
    lang: PropTypes.string,
    parent: PropTypes.string,
    uid: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    actions: PropTypes.object.isRequired,
    unsetIsEditing: PropTypes.func.isRequired,
    setIsDragging: PropTypes.func.isRequired,
    unsetIsDragging: PropTypes.func.isRequired,
    // Injected by React DnD DragSource
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    connectDragPreview: React.PropTypes.func.isRequired
  }

  static defaultProps = {
    lang: DEFAULT_LANG
  }

  render () {

    const {
      lang,
      parent,
      isRoot,
      uid,
      title,
      showAddButton,
      allowExpanding,
      isDragging,
      actions: { setIsEditing, unsetIsEditing, setShowButtons, toggleExpanded, deleteNode },
      connectDragSource
    } = this.props

    const className = classNames({ '-is-dragging': isDragging })

    return (
      connectDragSource(
        <div className={ className }>
          <NodeBody
            lang={ lang }
            parent={ parent }
            uid={ uid }
            title={ title }
            showAddButton={ showAddButton }
            showDeleteButton={ !isRoot }
            unsetIsEditing={ unsetIsEditing }
            setIsEditing={ setIsEditing }
            toggleExpanded={ toggleExpanded }
            deleteNode={ deleteNode }
            allowExpanding={ allowExpanding }
            setShowButtons={ setShowButtons }
          />
        </div>
      )
    )
  }
}

const mapStateToProps = (state, props) => ({
  lang: state.ui ? state.ui.lang : undefined,
  ...props
})
export default connect(mapStateToProps)(NodeDraggable)

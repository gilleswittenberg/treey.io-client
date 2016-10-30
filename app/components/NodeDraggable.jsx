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
    showAddButton: PropTypes.bool.isRequired,
    showDeleteButton: PropTypes.bool.isRequired,
    allowExpanding: PropTypes.bool.isRequired,
    unsetIsEditing: PropTypes.func.isRequired,
    setIsEditing: PropTypes.func.isRequired,
    toggleExpanded: PropTypes.func.isRequired,
    deleteNode: PropTypes.func.isRequired,
    putMoveNode: PropTypes.func.isRequired,
    setShowButtons: PropTypes.func.isRequired,
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
      setIsEditing,
      unsetIsEditing,
      setShowButtons,
      toggleExpanded,
      deleteNode,
      allowExpanding,
      connectDragSource,
      isDragging
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
  ...props,
  lang: state.ui && state.ui.lang
})
export default connect(mapStateToProps)(NodeDraggable)

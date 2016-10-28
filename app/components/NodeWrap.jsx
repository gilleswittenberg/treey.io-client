/* @flow */

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import NodeDraggable from '../components/NodeDraggable'
import NodeEdit from '../components/NodeEdit'
import NodeOver from '../components/NodeOver'
import Nodes from '../components/Nodes'
import { DropTarget } from 'react-dnd'
import DnDType from '../settings/DND_TYPE'
import {
  isEditing as isEditingFunc,
  hasButtonsShown as hasButtonsShownFunc,
  isExpanded as isExpandedFunc
} from '../reducers/ui'

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

    const item = monitor.getItem()
    const { parent, uid } = item
    const { parent: newParent } = props
    const overPosition = getOverMousePosition(monitor, component.element)
    const before = overPosition === 'top' ? props.uid : props.after

    // guard: do not save when node is dropped on original location
    if (before === item.after) return

    // save
    const { putMoveNode } = item
    putMoveNode(parent, uid, newParent, before)
  }
}

@DropTarget(DnDType, DropSpec, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  isOverItemUid: monitor.getItem() ? monitor.getItem().uid : null,
  canDrop: monitor.canDrop()
}))
export class NodeWrap extends Component {

  static propTypes = {
    lang: PropTypes.string,
    parent: PropTypes.string,
    isRoot: PropTypes.bool.isRequired,
    uid: PropTypes.string.isRequired,
    after: PropTypes.string,
    title: PropTypes.string.isRequired,
    nodes: PropTypes.array,
    hasNodes: PropTypes.bool.isRequired,
    ui: PropTypes.object.isRequired,
    isEditing: PropTypes.bool.isRequired,
    setIsEditing: PropTypes.func.isRequired,
    unsetIsEditing: PropTypes.func.isRequired,
    setShowButtons: PropTypes.func.isRequired,
    expand: PropTypes.func.isRequired,
    toggleExpanded: PropTypes.func.isRequired,
    postNode: PropTypes.func.isRequired,
    putNode: PropTypes.func.isRequired,
    deleteNode: PropTypes.func.isRequired,
    putMoveNode: PropTypes.func.isRequired,
    // Injected by React DnD DropTarget
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    isOverItemUid: PropTypes.string,
    canDrop: PropTypes.bool.isRequired
  }

  static defaultProps = {
    nodes: [],
    title: ''
  }

  state = {
    isOverPosition: -1
  }

  element = undefined

  render () {

    const {
      lang,
      parent,
      isRoot,
      uid,
      title,
      nodes,
      hasNodes,
      ui,
      setIsEditing,
      unsetIsEditing,
      setShowButtons,
      expand,
      toggleExpanded,
      isEditing,
      postNode,
      putNode,
      deleteNode,
      putMoveNode,
      connectDropTarget,
      isOver,
      isOverItemUid
    } = this.props
    const {
      isOverPosition
    } = this.state
    const isExpanded = isExpandedFunc(ui, uid)
    const isAdding = isEditingFunc(ui, uid, 'add')
    const hasButtonsShown = hasButtonsShownFunc(ui, uid)
    const isOverOther = isOver && isOverItemUid !== uid

    const className = classNames(
      'node',
      {
        '-is-editing': isEditing,
        '-is-expanded': (isExpanded && hasNodes) || isAdding,
        '-has-buttons-shown': hasButtonsShown
      }
    )

    const showNodeOverTop = !isEditing && isOverOther && isOverPosition === 'top'
    const showNodeBody = !isEditing
    const showNodeOverBottom = !isEditing && isOverOther && isOverPosition === 'bottom'
    const showNodeEdit = isEditing

    return (
      <div ref={ c => this.element = c }>

        { connectDropTarget(
          <div className={ className }>
            { showNodeOverTop &&
              <NodeOver position="top" />
            }
            { showNodeBody &&
              <NodeDraggable
                lang={ lang }
                parent={ parent }
                uid={ uid }
                title={ title }
                showAddButton={ hasNodes }
                showDeleteButton={ !isRoot }
                unsetIsEditing={ unsetIsEditing }
                setIsEditing={ setIsEditing }
                toggleExpanded={ toggleExpanded }
                deleteNode={ deleteNode }
                allowExpanding={ hasNodes }
                setShowButtons={ setShowButtons }
                putMoveNode={ putMoveNode }
              />
            }
            { showNodeOverBottom &&
              <NodeOver position="bottom" />
            }
            { showNodeEdit &&
              <NodeEdit
                lang={ lang }
                parent={ parent }
                uid={ uid }
                title={ title }
                unsetIsEditing={ unsetIsEditing }
                putNode={ putNode }
                deleteNode={ deleteNode }
              />
            }
          </div>
        ) }

        <Nodes
          lang={ lang }
          parent={ uid }
          nodes={ nodes }
          ui={ ui }
          setIsEditing={ setIsEditing }
          unsetIsEditing={ unsetIsEditing }
          setShowButtons={ setShowButtons }
          expand={ expand }
          toggleExpanded={ toggleExpanded }
          deleteNode={ deleteNode }
          postNode={ postNode }
          putNode={ putNode }
          putMoveNode={ putMoveNode }
        />
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  ...props,
  isRoot: props.parent === null,
  hasNodes: Array.isArray(props.nodes) && props.nodes.length > 0
})
export default connect(mapStateToProps)(NodeWrap)

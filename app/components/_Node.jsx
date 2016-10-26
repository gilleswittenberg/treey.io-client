/* @flow */

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import Nodes from '../components/Nodes'
import { DragSource, DropTarget } from 'react-dnd'
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

const DnDType = 'node'
const DragSpec = {
  beginDrag (props) {
    props.unsetIsEditing()
    return props
  },
  canDrag (props) {
    return !props.isRoot
  }
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

@DragSource(DnDType, DragSpec, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
  connectDragPreview: connect.dragPreview()
}))
@DropTarget(DnDType, DropSpec, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  isOverItemUid: monitor.getItem() ? monitor.getItem().uid : null,
  canDrop: monitor.canDrop()
}))
export class Node extends Component {

  static propTypes = {
    parent: PropTypes.string,
    isRoot: PropTypes.bool.isRequired,
    uid: PropTypes.string.isRequired,
    after: PropTypes.string,
    title: PropTypes.string.isRequired,
    nodes: PropTypes.array,
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
    // Injected by React DnD DragSource
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    connectDragPreview: React.PropTypes.func.isRequired,
    // Injected by React DnD DropTarget
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    isOverItemUid: PropTypes.string,
    canDrop: PropTypes.bool.isRequired
  }

  state = {
    isDragging: false,
    title: '',
    isOverPosition: -1
  }

  element = undefined

  constructor (props: any) {

    super(props)

    // @LINK: https://github.com/facebook/flow/issues/1517
    const self = (this: any)
    self.hasNodes = this.hasNodes.bind(this)
    self.handleClick = this.handleClick.bind(this)
    self.handleClickAdd = this.handleClickAdd.bind(this)
    self.handleClickEdit = this.handleClickEdit.bind(this)
    self.handleChange = this.handleChange.bind(this)
    self.handleClickDelete = this.handleClickDelete.bind(this)
    self.handleSubmit = this.handleSubmit.bind(this)
    self.handleClickShowButtons = this.handleClickShowButtons.bind(this)
  }

  hasNodes () {
    const { nodes } = this.props
    return !!(nodes && nodes.length > 0)
  }

  handleClick (event: Event) {

    // alt key to edit
    if (event.altKey) {
      this.startIsEditing()
    }
    // regular click to collapse or expand
    else {
      const { unsetIsEditing } = this.props
      unsetIsEditing()
      // guard
      if (!this.hasNodes()) return
      const { toggleExpanded, uid } = this.props
      toggleExpanded(uid)
    }
  }

  handleClickAdd () {
    const { uid, setIsEditing } = this.props
    setIsEditing(uid, 'add')
  }

  handleClickEdit () {
    this.startIsEditing()
  }

  startIsEditing () {
    const { uid, setIsEditing, title } = this.props
    this.setState({ title })
    setIsEditing(uid)
  }

  handleChange (event: Event) {
    const target = event.target
    if (target instanceof HTMLInputElement) {
      this.setState({ title: target.value })
    }
  }

  handleSubmit (event: Event) {
    event.preventDefault()
    const { parent, uid, title, deleteNode, putNode, unsetIsEditing } = this.props
    const { title: newTitle } = this.state
    const newTitleTrimmed = newTitle.trim()
    if (newTitleTrimmed === '') {
      deleteNode(parent, uid)
    } else if (title !== newTitleTrimmed) {
      putNode(uid, { title: newTitleTrimmed })
    }
    unsetIsEditing()
  }

  handleClickDelete () {
    const { parent, uid, deleteNode } = this.props
    deleteNode(parent, uid)
  }

  handleClickShowButtons (event: Event) {
    event.stopPropagation()
    const { uid, setShowButtons } = this.props
    setShowButtons(uid)
  }

  render () {

    const {
      isRoot,
      uid,
      title = '',
      nodes = [],
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
      connectDragSource,
      isDragging,
      connectDropTarget,
      isOver,
      isOverItemUid
    } = this.props
    const {
      title: value,
      isOverPosition
    } = this.state
    const isExpanded = isExpandedFunc(ui, uid)
    const hasButtonsShown = hasButtonsShownFunc(ui, uid)
    const hasChildren = nodes && nodes.length > 0
    const isAdding = isEditingFunc(ui, uid, 'add')
    const isOverOther = isOver && isOverItemUid !== uid

    const className = classNames(
      'node',
      {
        '-is-editing': isEditing,
        '-is-expanded': (isExpanded && hasChildren) || isAdding,
        '-is-dragging': isDragging,
        '-has-buttons-shown': hasButtonsShown
      }
    )

    const showAddButton = !this.hasNodes()
    const showDeleteButton = !isRoot
    let numButtons = 1
    if (showAddButton) numButtons++
    if (showDeleteButton) numButtons++
    const nodeButtonsClassName = classNames(
      'node-buttons',
      'node-buttons-default-hidden',
      {
        'node-buttons-num-2': numButtons === 2,
        'node-buttons-num-3': numButtons === 3
      }
    )

    const showOverTop = isOverOther && isOverPosition === 'top'
    const showOverBottom = isOverOther && isOverPosition === 'bottom'

    // @TODO: extract to isURL method
    const contentIsURL = title.match(/^https?:\/\//)

    return (
      <div ref={ c => this.element = c }>

        { connectDropTarget(connectDragSource(
          <div className={ className }>
            { !isEditing && showOverTop &&
              <div className="node-over node-over-top">
                <div></div>
              </div>
            }
            { !isEditing &&
              <div className="node-body">
                <div className={ nodeButtonsClassName }>
                  { showAddButton &&
                    <button onClick={ this.handleClickAdd } title="add">
                      <i className="fa fa-plus-square-o"></i>
                    </button>
                  }
                  <button onClick={ this.handleClickEdit } title="edit">
                    <i className="fa fa-pencil-square-o"></i>
                  </button>
                  { showDeleteButton &&
                    <button onClick={ this.handleClickDelete } title="delete">
                      <i className="fa fa-trash-o"></i>
                    </button>
                  }
                </div>
                <div className="node-content" onClick={ this.handleClick }>
                  <button className="node-button-show-buttons" onClick={ this.handleClickShowButtons } title="more">
                    <i className="fa fa-ellipsis-v"></i>
                  </button>
                  { contentIsURL && <span><a href={ title }>{ title }</a></span> }
                  { !contentIsURL && <span>{ title }</span> }
                </div>
              </div>
            }
            { !isEditing && showOverBottom &&
              <div className="node-over node-over-bottom">
                <div></div>
              </div>
            }
            { isEditing &&
              <div className="node-editing">
                <form onSubmit={ this.handleSubmit }>
                  <div className="node-buttons">
                    <button title="save">
                      <i className="fa fa-floppy-o"></i>
                    </button>
                  </div>
                  <div className="input-wrap">
                    <input
                      ref={ input => { if (input) input.focus() } }
                      value={ value }
                      onChange={ this.handleChange }
                    />
                  </div>
                </form>
              </div>
            }
          </div>
        )) }

        <Nodes
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

export default connect((state, props) => ({
  parent: props.parent,
  isRoot: props.parent === null,
  uid: props.uid,
  title: props.title,
  nodes: props.nodes,
  ui: props.ui,
  isEditing: props.isEditing,
  setIsEditing: props.setIsEditing,
  unsetIsEditing: props.unsetIsEditing,
  expand: props.expand,
  toggleExpanded: props.toggleExpanded,
  postNode: props.postNode,
  putNode: props.putNode,
  deleteNode: props.deleteNode,
  putMoveNode: props.putMoveNode
}))(Node)

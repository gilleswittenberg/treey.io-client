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
  }
}

const DropSpec = {

  canDrop (props) {
    return props.parent !== null
  },

  hover (props, monitor, component) {
    // guard
    if (props.parent === null) return
    const overPosition = getOverMousePosition (monitor, component.element)
    component.setState({ isOverPosition: overPosition })
  },

  drop (props, monitor, component) {

    const parent = monitor.getItem().parent
    const id = monitor.getItem().id
    const newParent = props.parent

    const overPosition = getOverMousePosition (monitor, component.element)
    const before = overPosition === 'top' ? props.id : props.after
    const moveNode = monitor.getItem().moveNode

    moveNode(parent, id, newParent, before)
  }
}

@DragSource(DnDType, DragSpec, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging()
}))
@DropTarget(DnDType, DropSpec, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  isOverItemId: monitor.getItem() ? monitor.getItem().id : null,
  canDrop: monitor.canDrop()
}))
class Node extends Component {

  static propTypes = {
    parent: PropTypes.string,
    id: PropTypes.string.isRequired,
    after: PropTypes.string,
    title: PropTypes.string.isRequired,
    nodes: PropTypes.array,
    ui: PropTypes.object.isRequired,
    isEditing: PropTypes.bool.isRequired,
    setIsEditing: PropTypes.func.isRequired,
    unsetIsEditing: PropTypes.func.isRequired,
    setShowButtons: PropTypes.func.isRequired,
    postNode: PropTypes.func.isRequired,
    putNode: PropTypes.func.isRequired,
    deleteNode: PropTypes.func.isRequired,
    moveNode: PropTypes.func.isRequired,
    // Injected by React DnD DragSource
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    connectDragPreview: React.PropTypes.func.isRequired,
    // Injected by React DnD DropTarget
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    isOverItemId: PropTypes.string,
    canDrop: PropTypes.bool.isRequired
  }

  state = {
    isDragging: false
  }

  constructor (props) {

    super(props)

    this.hasNodes = this.hasNodes.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleClickAdd = this.handleClickAdd.bind(this)
    this.handleClickEdit = this.handleClickEdit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleClickDelete = this.handleClickDelete.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleClickShowButtons = this.handleClickShowButtons.bind(this)
  }

  hasNodes () {
    const { nodes } = this.props
    return !!(nodes && nodes.length > 0)
  }

  handleClick (event) {

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
      const { toggleExpanded, id } = this.props
      toggleExpanded(id)
    }
  }

  handleClickAdd () {
    const { id, setIsEditing } = this.props
    setIsEditing(id, 'add')
  }

  handleClickEdit () {
    this.startIsEditing()
  }

  startIsEditing () {
    const { id, setIsEditing, title } = this.props
    this.setState({ title })
    setIsEditing(id)
  }

  handleChange (event) {
    this.setState({ title: event.target.value })
  }

  handleSubmit (event) {
    event.preventDefault()
    const { id, title, putNode, unsetIsEditing } = this.props
    const { title: newTitle } = this.state
    if (title !== newTitle) {
      putNode(id, { title: newTitle })
    }
    unsetIsEditing()
  }

  handleClickDelete () {
    const { parent, id, deleteNode } = this.props
    deleteNode(parent, id)
  }

  handleClickShowButtons (event) {
    event.stopPropagation()
    const { id, setShowButtons } = this.props
    setShowButtons(id)
  }

  render () {

    const {
      parent,
      id,
      title = '',
      nodes = [],
      ui,
      setIsEditing,
      unsetIsEditing,
      setShowButtons,
      toggleExpanded,
      expand,
      isEditing,
      postNode,
      putNode,
      deleteNode,
      moveNode,
      connectDragSource,
      isDragging,
      connectDropTarget,
      isOver,
      isOverItemId
    } = this.props
    const {
      title: value,
      isOverPosition
    } = this.state
    const isExpanded = isExpandedFunc(ui, id)
    const hasButtonsShown = hasButtonsShownFunc(ui, id)
    const hasChildren = nodes.length > 0
    const isAdding = isEditingFunc(ui, id, 'add')
    const isOverOther = isOver && isOverItemId !== id

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
    const showDeleteButton = parent !== null
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
                    <button onClick={ this.handleClickAdd }>
                      <i className="fa fa-plus-square-o"></i>
                    </button>
                  }
                  <button onClick={ this.handleClickEdit }>
                    <i className="fa fa-pencil-square-o"></i>
                  </button>
                  { showDeleteButton &&
                    <button onClick={ this.handleClickDelete }>
                      <i className="fa fa-trash-o"></i>
                    </button>
                  }
                </div>
                <div className="node-content" onClick={ this.handleClick } onDoubleClick={ this.handleDoubleClick }>
                  <button className="node-button-show-buttons" onClick={ this.handleClickShowButtons }>
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
                    <button>
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
          parent={ id }
          nodes={ nodes }
          ui={ ui }
          setIsEditing={ setIsEditing }
          unsetIsEditing={ unsetIsEditing }
          setShowButtons={ setShowButtons }
          toggleExpanded={ toggleExpanded }
          expand={ expand }
          deleteNode={ deleteNode }
          postNode={ postNode }
          putNode={ putNode }
          moveNode={ moveNode }
        />
      </div>
    )
  }
}

export default connect((state, props) => ({
  parent: props.parent,
  id: props.id,
  title: props.title,
  nodes: props.nodes,
  ui: props.ui,
  isEditing: props.isEditing,
  setIsEditing: props.setIsEditing,
  unsetIsEditing: props.unsetIsEditing,
  toggleExpanded: props.toggleExpanded,
  postNode: props.postNode,
  putNode: props.putNode,
  deleteNode: props.deleteNode,
  moveNode: props.moveNode
}))(Node)

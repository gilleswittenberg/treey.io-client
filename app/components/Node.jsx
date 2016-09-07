import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import Nodes from '../components/Nodes'
import { DragSource, DropTarget } from 'react-dnd'

const DnDType = 'node'
const DragSpec = {
  beginDrag (props) {
    return props
  }
}

const DropSpec = {

  hover (props, monitor, component) {

    const height = 34 // 32 height + 2 margin
    const yDrag = monitor.getClientOffset().y
    const yDrop = component.element.getBoundingClientRect().top
    const isOverPosition = yDrag - yDrop < height / 2 ? 'top' : 'bottom'
    component.setState({ isOverPosition })
  },

  drop (props, monitor) {
    const parent = monitor.getItem().parent
    const id = monitor.getItem().id
    const newParent = props.parent
    const before = props.id
    const moveNode = monitor.getItem().moveNode
    //moveNode(parent, id, newParent, before)
  }
}

@DragSource(DnDType, DragSpec, (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
})
@DropTarget(DnDType, DropSpec, (connect, monitor) => {
  const isOverItemId = monitor.getItem() ? monitor.getItem().id : null
  const isOver = monitor.isOver()

  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverItemId,
    canDrop: monitor.canDrop()
  }
})
class Node extends React.Component {

  static propTypes = {
    parent: React.PropTypes.string,
    id: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    nodes: React.PropTypes.array,
    ui: React.PropTypes.object.isRequired,
    isEditing: React.PropTypes.bool.isRequired,
    setIsEditing: React.PropTypes.func.isRequired,
    unsetIsEditing: React.PropTypes.func.isRequired,
    postNode: React.PropTypes.func.isRequired,
    putNode: React.PropTypes.func.isRequired,
    deleteNode: React.PropTypes.func.isRequired,
    moveNode: React.PropTypes.func.isRequired,
    // Injected by React DnD DragSource
    connectDragSource: React.PropTypes.func.isRequired,
    isDragging: React.PropTypes.bool.isRequired,
    // Injected by React DnD DropTarget
    connectDropTarget: React.PropTypes.func.isRequired,
    isOver: React.PropTypes.bool.isRequired,
    isOverItemId: React.PropTypes.string,
    canDrop: React.PropTypes.bool.isRequired
  }

  state = {
    isExpanded: false,
    isDragging: false
  }

  constructor (props) {

    super(props)

    this.handleClick = this.handleClick.bind(this)
    this.handleClickEdit = this.handleClickEdit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleClickDelete = this.handleClickDelete.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleClick () {
    this.setState({ isExpanded: !this.state.isExpanded })
  }

  handleClickEdit () {
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

  render () {

    const {
      parent,
      id,
      title = '',
      nodes = [],
      ui,
      setIsEditing,
      unsetIsEditing,
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
    const { title: value, isExpanded, isOverPosition } = this.state
    const isOverOther = isOver && isOverItemId !== id

    const className = classNames(
      'node',
      {
        '-is-editing': isEditing,
        '-is-expanded': isExpanded,
        '-is-dragging': isDragging
      }
    )

    const showDeleteButton = parent !== null
    const nodeButtonsClassName = classNames(
      'node-buttons',
      'node-buttons-default-hidden',
      { 'node-buttons-num-2': showDeleteButton }
    )

    const showOverTop = isOverOther && isOverPosition === 'top'
    const showOverBottom = isOverOther && isOverPosition === 'bottom'

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
                  <button onClick={ this.handleClickEdit }>E</button>
                  { showDeleteButton && <button onClick={ this.handleClickDelete }>X</button> }
                </div>
                <div className="node-content" onClick={ this.handleClick }>
                  <span>{ title } <span>{ id }</span></span>
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
                    <button>S</button>
                  </div>
                  <div className="input-wrap">
                    <input ref={ input => { if (input) input.focus() } } value={ value } onChange={ this.handleChange }></input>
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
  postNode: props.postNode,
  putNode: props.putNode,
  deleteNode: props.deleteNode,
  moveNode: props.moveNode
}))(Node)

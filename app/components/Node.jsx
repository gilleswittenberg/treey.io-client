import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import Nodes from '../components/Nodes'

export default class Node extends React.Component {

  constructor (props) {

    super(props)

    this.handleClick = this.handleClick.bind(this)
    this.handleClickEdit = this.handleClickEdit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleClickDelete = this.handleClickDelete.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    this.state = { isExpanded: false }
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
    const { id, putNode, unsetIsEditing } = this.props
    const { title } = this.state
    putNode(id, { title })
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
      nodes,
      ui,
      setIsEditing,
      unsetIsEditing,
      isEditing,
      postNode,
      putNode,
      deleteNode
    } = this.props
    const { title: value, isExpanded } = this.state

    const className = classNames(
      'node',
      {
        '-is-editing': isEditing,
        '-is-expanded': isExpanded
      }
    )

    const showDeleteButton = parent !== null
    const buttonDisabled = title === value
    const nodeButtonsClassName = classNames(
      'node-buttons',
      'node-buttons-default-hidden',
      { 'node-buttons-num-2': showDeleteButton }
    )

    return (
      <div>

        <div className={ className }>
          { !isEditing &&
            <div className="node-body">
              <div className={ nodeButtonsClassName }>
                <button onClick={ this.handleClickEdit }>E</button>
                { showDeleteButton && <button onClick={ this.handleClickDelete }>X</button> }
              </div>
              <div className="node-content" onClick={ this.handleClick }>
                <span>{ title }</span>
              </div>
            </div>
          }
          { isEditing &&
            <div className="node-editing">
              <form onSubmit={ this.handleSubmit }>
                <div className="node-buttons">
                  <button disabled={ buttonDisabled }>S</button>
                </div>
                <div className="input-wrap">
                  <input ref={ input => { if (input) input.focus() } } value={ value } onChange={ this.handleChange }></input>
                </div>
              </form>
            </div>
          }
        </div>

        <Nodes
          deleteNode={ deleteNode }
          postNode={ postNode }
          putNode={ putNode }
          setIsEditing={ setIsEditing }
          unsetIsEditing={ unsetIsEditing }
          parent={ id }
          nodes={ nodes }
          ui={ ui }
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
  deleteNode: props.deleteNode
}))(Node)

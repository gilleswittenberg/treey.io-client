import React from 'react'
import ReactDOM from 'react-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { putNode, deleteNode } from '../actions/nodes'
import { setIsEditing, unsetIsEditing } from '../actions/ui'
import NodeAdd from '../components/NodeAdd'

export default class Node extends React.Component {

  constructor (props) {

    super(props)

    this.handleClick = this.handleClick.bind(this)
    this.handleClickEdit = this.handleClickEdit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleClickDelete = this.handleClickDelete.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    this.state = {
      isExpanded: false,
      value: props.title
    }
  }

  componentWillReceiveProps (props) {
    this.setState({ value: props.title })
  }

  handleClick () {
    this.setState({ isExpanded: !this.state.isExpanded })
  }

  handleClickEdit () {
    const { dispatch, id } = this.props
    dispatch(setIsEditing(id))

    // waiting to focus input after form CSS display is set to 'block' in render
    window.requestAnimationFrame(() => {
      const inputKey = `input.${ id }`
      ReactDOM.findDOMNode(this.refs[inputKey]).focus()
    })
  }

  handleChange (event) {
    this.setState({ value: event.target.value })
  }

  handleSubmit (event) {
    event.preventDefault()
    const { dispatch, id } = this.props
    dispatch(putNode(id, { title: this.state.value }))
    dispatch(unsetIsEditing())
  }

  handleClickDelete () {
    const { dispatch, parent, id } = this.props
    dispatch(deleteNode(parent, id))
  }

  render () {

    const { parent, id, title = '', nodes = [], ui, dispatch } = this.props
    const isEditing = ui.isEditing === id
    const { value, isExpanded } = this.state
    const inputRef = `input.${ id }`

    const classNames = ['node']
    if (isEditing) {
      classNames.push('-is-editing')
    }
    if (isExpanded) {
      classNames.push('-is-expanded')
    }
    const className = classNames.join(' ')

    const showDeleteButton = parent !== null
    const buttonDisabled = title === this.state.value
    const nodeButtonsClassNames = ['node-buttons', 'node-buttons-default-hidden']
    if (showDeleteButton) {
      nodeButtonsClassNames.push('node-buttons-num-2')
    }
    const nodeButtonsClassName = nodeButtonsClassNames.join(' ')

    return (
      <div>

        <div className={ className }>
          <div className="node-body">
            <div className={ nodeButtonsClassName }>
              <button onClick={ this.handleClickEdit }>E</button>
              { showDeleteButton && <button onClick={ this.handleClickDelete }>X</button> }
            </div>
            <div className="node-content" onClick={ this.handleClick }>
              <span>{ title }</span>
            </div>
          </div>
          <div className="node-editing">
            <form onSubmit={ this.handleSubmit }>
              <div className="node-buttons">
                <button disabled={ buttonDisabled }>S</button>
              </div>
              <div className="input-wrap">
                <input ref={ inputRef } value={ value } onChange={ this.handleChange }></input>
              </div>
            </form>
          </div>
        </div>

        <ul>
          { nodes.map((node, index) =>
            <li key={ index }>
              <Node
                dispatch={ dispatch }
                parent={ id }
                id={ node._id }
                title={ node.title }
                nodes={ node.nodes }
                ui={ ui }>
              </Node>
            </li>
          ) }
          <li>
            <NodeAdd parent={ id } dispatch={ dispatch } ui={ ui }></NodeAdd>
          </li>
        </ul>

      </div>
    )
  }
}

export default compose(
  connect((state, props) => ({
    dispatch: props.dispatch,
    parent: props.parent,
    id: props.id,
    title: props.title,
    nodes: props.nodes,
    ui: props.ui
  }))
)(Node)

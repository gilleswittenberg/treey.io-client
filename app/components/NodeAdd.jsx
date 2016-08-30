import React from 'react'
import ReactDOM from 'react-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { postNode } from '../actions/nodes.js'
import { setIsEditing, unsetIsEditing } from '../actions/ui.js'

export default class AddForm extends React.Component {

  constructor (props) {

    super(props)

    this.handleClick = this.handleClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    this.state = { value: '' }
  }

  _editingId () {
    const { parent } = this.props
    return `${ parent }.add`
  }

  handleClick () {
    const { dispatch } = this.props
    dispatch(setIsEditing(this._editingId()))

    // waiting to focus input after form CSS display is set to 'block' in render
    window.requestAnimationFrame(() => {
      const inputKey = `input.${ this._editingId() }`
      ReactDOM.findDOMNode(this.refs[inputKey]).focus()
    })
  }

  handleChange (event) {
    this.setState({ value: event.target.value })
  }

  handleSubmit (event) {
    event.preventDefault()
    const { dispatch, parent } = this.props
    const data = { title: this.state.value }
    dispatch(postNode(data, parent))
    dispatch(unsetIsEditing())

    this.setState({ value: '' })
  }

  render () {

    const { ui } = this.props
    const editingId = this._editingId()
    const isEditing = ui.isEditing === editingId
    const className = isEditing ? '-is-editing' : ''
    const inputRef = `input.${ editingId }`

    return (
      <div className={ className }>
        <button onClick={ this.handleClick }>+</button>
        <form onSubmit={ this.handleSubmit }>
          <button>+</button>
          <div className="input-wrap">
            <input ref={ inputRef } onChange={ this.handleChange } value={ this.state.value }></input>
          </div>
        </form>
      </div>
    )
  }
}

export default compose(
  connect((state, props) => ({
    parent: props.parent,
    ui: props.ui,
    dispatch: props.dispatch
  }))
)(AddForm)

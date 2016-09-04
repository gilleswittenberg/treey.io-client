import React from 'react'
import ReactDOM from 'react-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { postNode } from '../actions/nodes'
import { setIsEditing, unsetIsEditing } from '../actions/ui'
import classNames from 'classnames'

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
    const inputRef = `input.${ editingId }`

    const isEditing = ui.isEditing === editingId
    const className = classNames(
      'node',
      'node-add',
      { '-is-editing': isEditing }
    )

    const buttonDisabled = this.state.value === ''

    return (
      <div className={ className }>

        <div className="node-body">
          <button onClick={ this.handleClick }>+</button>
        </div>

        <div className="node-editing">
          <form onSubmit={ this.handleSubmit }>
            <div className="node-buttons">
              <button disabled={ buttonDisabled }>+</button>
            </div>
            <div className="input-wrap">
              <input ref={ inputRef } onChange={ this.handleChange } value={ this.state.value }></input>
            </div>
          </form>
        </div>

      </div>
    )
  }
}

export default compose(
  connect((state, props) => ({
    dispatch: props.dispatch,
    ui: props.ui,
    parent: props.parent
  }))
)(AddForm)

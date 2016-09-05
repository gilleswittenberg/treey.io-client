import React from 'react'
import ReactDOM from 'react-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
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
    const { parent, setIsEditing } = this.props
    setIsEditing(parent, 'add')

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
    const { parent, postNode, unsetIsEditing } = this.props
    const data = { title: this.state.value }
    postNode(parent, data)
    unsetIsEditing()

    this.setState({ value: '' })
  }

  render () {

    const { isEditing } = this.props
    const editingId = this._editingId()
    const inputRef = `input.${ editingId }`

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
    postNode: props.postNode,
    setIsEditing: props.setIsEditing,
    unsetIsEditing: props.unsetIsEditing,
    isEditing: props.isEditing,
    parent: props.parent
  }))
)(AddForm)

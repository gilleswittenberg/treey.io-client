import React from 'react'
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
    const isEditing = ui.isEditing === this._editingId()
    const className = isEditing ? '-is-editing' : ''

    return (
      <div className={ className }>
        <button onClick={ this.handleClick }>+</button>
        <form onSubmit={ this.handleSubmit }>
          <button>+</button>
          <div className="input-wrap">
            <input onChange={ this.handleChange } value={ this.state.value }></input>
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

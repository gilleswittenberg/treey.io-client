import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { postNode } from '../actions/nodes.js'

export default class AddForm extends React.Component {

  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = { value: '' }
  }

  handleChange (event) {
    this.setState({ value: event.target.value })
  }

  handleSubmit (event) {
    event.preventDefault()
    const dispatch = this.props.dispatch
    const parent = this.props.parent
    const data = { title: this.state.value }
    dispatch(postNode(data, parent))
    this.setState({ value: '' })
  }

  render () {
    return (
      <form onSubmit={ this.handleSubmit }>
        <input name="node" onChange={ this.handleChange } value={ this.state.value }></input>
        <button type="submit">+</button>
      </form>
    )
  }
}

export default compose(
  connect((state, props) => ({
    parent: props.parent,
    dispatch: props.dispatch
  }))
)(AddForm)

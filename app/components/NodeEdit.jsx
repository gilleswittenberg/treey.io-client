/* @flow */

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import type { NodeEditProps as Props } from '../../flow/types'

export class NodeEdit extends Component {

  static propTypes = {
    parent: PropTypes.string.isRequired,
    uid: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    unsetIsEditing: PropTypes.func.isRequired,
    putNode: PropTypes.func.isRequired,
    deleteNode: PropTypes.func.isRequired
  }

  state = {
    title: ''
  }

  constructor (props: Props) {

    super(props)

    const { title } = props
    this.state.title = title

    // @LINK: https://github.com/facebook/flow/issues/1517
    const self = (this: any)
    self.handleChange = this.handleChange.bind(this)
    self.handleSubmit = this.handleSubmit.bind(this)
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

  render () {

    const { title: value } = this.state

    return (
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
    )
  }
}

export default connect((state, props) => ({
  parent: props.parent,
  uid: props.uid,
  unsetIsEditing: props.unsetIsEditing,
  putNode: props.putNode,
  deleteNode: props.deleteNode
}))(NodeEdit)

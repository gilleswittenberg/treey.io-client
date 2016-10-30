/* @flow */

import autobind from 'autobind-decorator'
import React, { Component, PropTypes } from 'react'
import ButtonIcon from '../components/ButtonIcon'
import DEFAULT_LANG from '../settings/DEFAULT_LANG'

export default class NodeEdit extends Component {

  static propTypes = {
    lang: PropTypes.string,
    parent: PropTypes.string.isRequired,
    uid: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    unsetIsEditing: PropTypes.func.isRequired,
    putNode: PropTypes.func.isRequired,
    deleteNode: PropTypes.func.isRequired
  }

  static defaultProps = {
    lang: DEFAULT_LANG
  }

  state = {
    title: ''
  }

  constructor (props: any) {

    super(props)

    const { title } = props
    this.state.title = title
  }

  @autobind
  handleChange (event: Event) {
    const target = event.target
    if (target instanceof HTMLInputElement) {
      this.setState({ title: target.value })
    }
  }

  @autobind
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

    const { lang } = this.props
    const { title: value } = this.state

    return (
      <div className="node-editing">
        <form onSubmit={ this.handleSubmit }>
          <div className="node-buttons">
            <ButtonIcon type="SAVE" lang={ lang } />
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

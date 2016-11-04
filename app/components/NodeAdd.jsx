/* @flow */

import autobind from 'autobind-decorator'
import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import ButtonIcon from './ButtonIcon'
import DEFAULT_LANG from '../settings/DEFAULT_LANG'

export default class NodeAdd extends Component {

  static propTypes = {
    lang: PropTypes.string.isRequired,
    parent: PropTypes.string.isRequired,
    isEditing: PropTypes.bool.isRequired,
    setIsEditing: PropTypes.func.isRequired,
    unsetIsEditing: PropTypes.func.isRequired,
    expand: PropTypes.func.isRequired,
    postNode: PropTypes.func.isRequired
  }

  static defaultProps = {
    lang: DEFAULT_LANG
  }

  state = {
    title: ''
  }

  // clear input when user starts adding
  componentWillReceiveProps (nextProps: any) {
    if (nextProps.isEditing !== this.props.isEditing) {
      this.setState({ title: '' })
    }
  }

  @autobind
  handleClick () {
    const { parent, setIsEditing } = this.props
    this.setState({ title: '' })
    setIsEditing(parent, 'add')
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

    const { parent, postNode, unsetIsEditing, expand } = this.props
    const { title } = this.state
    const titleTrimmed = title.trim()

    // guard: do not save empty string
    if (titleTrimmed === '') {
      unsetIsEditing()
      return
    }

    const data = { title: titleTrimmed }
    postNode(parent, data)
    unsetIsEditing()
    expand(parent)
  }

  render () {

    const { lang, isEditing } = this.props
    const { title: value } = this.state

    const className = classNames(
      'node',
      'node-add',
      { '-is-editing': isEditing }
    )

    return (
      <div className={ className }>

        { !isEditing &&
          <div className="node-body">
            <ButtonIcon type="ADD" lang={ lang } handleClick={ this.handleClick } />
          </div>
        }

        { isEditing &&
          <div className="node-editing">
            <form onSubmit={ this.handleSubmit }>
              <div className="node-buttons">
                <ButtonIcon type="SAVE" lang={ lang } />
              </div>
              <div className="input-wrap">
                <input
                  ref={ input => { if (input) input.focus() } }
                  onChange={ this.handleChange }
                  value={ value }
                  autoCapitalize="off"
                />
              </div>
            </form>
          </div>
        }

      </div>
    )
  }
}

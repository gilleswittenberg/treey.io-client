/* @flow */

import autobind from 'autobind-decorator'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import ButtonIcon from './ButtonIcon'

export class NodeAdd extends Component {

  static propTypes = {
    parent: PropTypes.string.isRequired,
    isEditing: PropTypes.bool.isRequired,
    setIsEditing: PropTypes.func.isRequired,
    unsetIsEditing: PropTypes.func.isRequired,
    expand: PropTypes.func.isRequired,
    postNode: PropTypes.func.isRequired
  }

  state = {
    title: ''
  }

  // clear input when user starts adding
  componentWillUpdate (nextProps: any) {
    if (nextProps.isEditing === true && this.props.isEditing === false) {
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
    this.setState({ title: '' })

    // guard
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

export default connect()(NodeAdd)

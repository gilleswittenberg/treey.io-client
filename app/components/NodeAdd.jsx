/* @flow */

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import __ from '../lib/i18n'

import type { NodeAddProps as Props } from '../../flow/types'

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

  constructor (props: Props) {

    super(props)

    // @LINK: https://github.com/facebook/flow/issues/1517
    const self = (this: any)
    self.handleClick = this.handleClick.bind(this)
    self.handleChange = this.handleChange.bind(this)
    self.handleSubmit = this.handleSubmit.bind(this)
  }

  // clear input when user starts adding
  componentWillUpdate (nextProps: Props) {
    if (nextProps.isEditing === true && this.props.isEditing === false) {
      this.setState({ title: '' })
    }
  }

  handleClick () {
    const { parent, setIsEditing } = this.props
    this.setState({ title: '' })
    setIsEditing(parent, 'add')
  }

  handleChange (event: Event) {
    const target = event.target
    if (target instanceof HTMLInputElement) {
      this.setState({ title: target.value })
    }
  }

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
            <button onClick={ this.handleClick } title={ __(lang, 'ADD') }>
              <i className="fa fa-plus-square-o"></i>
            </button>
          </div>
        }

        { isEditing &&
          <div className="node-editing">
            <form onSubmit={ this.handleSubmit }>
              <div className="node-buttons">
                <button title={ __(lang, 'SAVE') }>
                  <i className="fa fa-floppy-o"></i>
                </button>
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

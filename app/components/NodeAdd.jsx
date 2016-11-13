/* @flow */

import autobind from 'autobind-decorator'
import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import ButtonIcon from './ButtonIcon'
import DEFAULT_LANG from '../settings/DEFAULT_LANG'

export default class NodeAdd extends Component {

  static propTypes = {
    lang: PropTypes.string,
    parent: PropTypes.string.isRequired,
    ui: PropTypes.object.isRequired,
    clearNodeUI: PropTypes.func.isRequired,
    updateNodeUI: PropTypes.func.isRequired,
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
    if (nextProps.ui.adding !== this.props.ui.adding) {
      this.setState({ title: '' })
    }
  }

  @autobind
  handleClick (event: Event) {
    event.stopPropagation()
    const { path, updateNodeUI } = this.props
    this.setState({ title: '' })
    updateNodeUI(path, 'adding', true)
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

    const { parent, postNode, clearNodeUI, updateNodeUI } = this.props
    const { title } = this.state
    const titleTrimmed = title.trim()

    // @TODO: combine
    clearNodeUI('editing')
    clearNodeUI('adding')

    // guard: do not save empty string
    if (titleTrimmed === '') {
      return
    }

    const data = { title: titleTrimmed }
    postNode(parent, data)

    // expand to open node that had no children before
    updateNodeUI(parent.path, 'expanded', true)
  }

  render () {

    const { lang, ui: { adding } } = this.props
    const { title: value } = this.state

    const className = classNames(
      'node',
      'node-add',
      { '-is-editing': adding }
    )

    return (
      <div className={ className }>

        { !adding &&
          <div className="node-body">
            <ButtonIcon type="ADD" lang={ lang } handleClick={ this.handleClick } />
          </div>
        }

        { adding &&
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

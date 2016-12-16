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
    path: PropTypes.array.isRequired,
    ui: PropTypes.object.isRequired,
    clearUIEditing: PropTypes.func.isRequired,
    clearNodeUI: PropTypes.func.isRequired,
    updateNodeUI: PropTypes.func.isRequired,
    setUIAdding: PropTypes.func.isRequired,
    setUIExpanded: PropTypes.func.isRequired,
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
    this.setState({ title: '' })
    const { path, setUIAdding } = this.props
    setUIAdding(path)
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

    const { parent, path, postNode, clearUIEditing, setUIExpanded } = this.props
    const { title } = this.state
    const titleTrimmed = title.trim()

    clearUIEditing()

    // guard: do not save empty string
    if (titleTrimmed === '') {
      return
    }

    const data = { title: titleTrimmed }
    postNode(parent, path, data)

    // expand to open node that had no children before
    setUIExpanded(path)
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

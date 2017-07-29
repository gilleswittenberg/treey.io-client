/* @flow */

import autobind from 'autobind-decorator'
import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import ButtonIcon from './ButtonIcon'
import DEFAULT_LANG from '../settings/DEFAULT_LANG'
import arraysEqual from '../lib/utils/arraysEqual'
import propTypeShapeUI from '../lib/ui/propTypeShapeUI'

export default class NodeAdd extends Component {

  static propTypes = {
    lang: PropTypes.string,
    parent: PropTypes.string.isRequired,
    treePath: PropTypes.array.isRequired,
    ui: PropTypes.shape(propTypeShapeUI),
    setUIAdding: PropTypes.func.isRequired,
    setUIExpanded: PropTypes.func.isRequired,
    clearUIEditingAdding: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired
  }

  static defaultProps = {
    lang: DEFAULT_LANG
  }

  state = {
    title: ''
  }

  // Clear input when user starts adding
  componentWillReceiveProps (nextProps: any) {
    if (nextProps.ui.adding !== this.props.ui.adding) {
      this.setState({ title: '' })
    }
  }

  @autobind
  handleClick (event: Event) {
    event.stopPropagation()
    this.setState({ title: '' })
    const { treePath, setUIAdding } = this.props
    setUIAdding(treePath)
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

    const { treePath, create, clearUIEditingAdding, setUIExpanded } = this.props
    const { title } = this.state
    const titleTrimmed = title.trim()

    clearUIEditingAdding()

    // Guard: do not save empty string
    if (titleTrimmed === '') return

    const data = { title: titleTrimmed }
    create(treePath, data)

    // Expand to open parent
    setUIExpanded(treePath)
  }

  isAdding () : bool {
    const { ui, treePath } = this.props
    if (ui && ui.adding) {
      if (arraysEqual(ui.adding, treePath)) {
        return true
      }
    }
    return false
  }

  render () {

    const { lang } = this.props
    const { title: value } = this.state
    const isAdding = this.isAdding()

    const className = classNames(
      'node',
      'node-add',
      { '-is-editing': isAdding }
    )

    const buttonIconProps = {
      type: 'SAVE',
      lang,
      tabIndex: 2
    }

    return (
      <div className={ className }>

        { !isAdding &&
          <div className="node-body">
            <ButtonIcon type="ADD" lang={ lang } handleClick={ this.handleClick } />
          </div>
        }

        { isAdding &&
          <div className="node-editing">
            <form onSubmit={ this.handleSubmit }>
              <div className="node-buttons">
                <ButtonIcon { ...buttonIconProps } />
              </div>
              <div className="input-wrap">
                <input
                  ref={ input => { if (input) input.focus() } }
                  onChange={ this.handleChange }
                  value={ value }
                  autoCapitalize="off"
                  tabIndex="1"
                />
              </div>
            </form>
          </div>
        }

      </div>
    )
  }
}

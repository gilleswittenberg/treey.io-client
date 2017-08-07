/* @flow */

import autobind from 'autobind-decorator'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ButtonIcon from '../components/ButtonIcon'
import DEFAULT_LANG from '../settings/DEFAULT_LANG'
import focusInput from '../lib/ui/focusInput'

export default class NodeEdit extends Component {

  static propTypes = {
    lang: PropTypes.string,
    parent: PropTypes.string,
    treePath: PropTypes.array.isRequired,
    uuid: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    clearUIEditingAdding: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired
  }

  static defaultProps = {
    lang: DEFAULT_LANG
  }

  state = {
    title: ''
  }

  constructor (props: any) {
    super(props)
    this.state.title = props.title // eslint-disable-line react/no-direct-mutation-state
  }

  componentWillReceiveProps (nextProps: any) {
    if (nextProps.title !== this.props.title) {
      this.setState({ title: nextProps.title })
    }
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
    const { parent, treePath, title, remove, update, clearUIEditingAdding } = this.props
    const { title: newTitle } = this.state
    const newTitleTrimmed = newTitle.trim()
    // @TODO: what to do for parent && newTitleTrimmed == ''?
    // @TODO: use !isRoot vs parent != null, remove parent from properties
    if (parent != null && newTitleTrimmed === '') {
      remove(treePath)
    } else if (title !== newTitleTrimmed) {
      update(treePath, { title: newTitleTrimmed })
    }
    clearUIEditingAdding()
  }

  handleClick (event: Event) {
    event.stopPropagation()
  }

  render () {

    const { lang } = this.props
    const { title: value } = this.state
    const buttonIconProps = {
      type: 'SAVE',
      lang,
      tabIndex: 2
    }

    return (
      <div className="node-editing">
        <form onSubmit={ this.handleSubmit }>
          <div className="node-buttons">
            <ButtonIcon { ...buttonIconProps } />
          </div>
          <div className="input-wrap">
            <input
              ref={ focusInput }
              value={ value }
              onChange={ this.handleChange }
              onClick={ this.handleClick }
              tabIndex="1"
            />
          </div>
        </form>
      </div>
    )
  }
}

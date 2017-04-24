/* @flow */

import autobind from 'autobind-decorator'
import React, { Component, PropTypes } from 'react'
import ButtonIcon from '../components/ButtonIcon'
import DEFAULT_LANG from '../settings/DEFAULT_LANG'

export default class NodeEdit extends Component {

  static propTypes = {
    lang: PropTypes.string,
    parent: PropTypes.string,
    treePath: PropTypes.array.isRequired,
    uid: PropTypes.string.isRequired,
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
    this.state.title = props.title
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
              onClick={ this.handleClick }
            />
          </div>
        </form>
      </div>
    )
  }
}

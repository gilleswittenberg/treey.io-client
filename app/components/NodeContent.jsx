/* @flow */

import React, { Component, PropTypes } from 'react'
import isURL from '../lib/utils/isURL'
import ButtonIcon from './ButtonIcon'
import DEFAULT_LANG from '../settings/DEFAULT_LANG'

export default class NodeContent extends Component {

  static propTypes = {
    lang: PropTypes.string,
    title: PropTypes.string.isRequired,
    handleClick: PropTypes.func.isRequired,
    handleClickMore: PropTypes.func.isRequired
  }

  static defaultProps = {
    lang: DEFAULT_LANG
  }

  render () {

    const { title, lang, handleClick, handleClickMore } = this.props
    const contentIsURL = isURL(title)

    return (
      <div className="node-content" onClick={ handleClick }>
        <ButtonIcon type="MORE" lang={ lang } handleClick={ handleClickMore } />
        { contentIsURL && <span><a href={ title }>{ title }</a></span> }
        { !contentIsURL && <span>{ title }</span> }
      </div>
    )
  }
}

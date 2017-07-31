/* @flow */

import React, { Component, PropTypes } from 'react'
import isURL from '../lib/utils/isURL'
import ButtonIcon from './ButtonIcon'
import DEFAULT_LANG from '../settings/DEFAULT_LANG'
import { Link } from 'react-router'

export default class NodeContent extends Component {

  static propTypes = {
    lang: PropTypes.string,
    title: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
    handleClick: PropTypes.func.isRequired,
    handleClickMore: PropTypes.func.isRequired
  }

  static defaultProps = {
    lang: DEFAULT_LANG
  }

  handleClickInfo (event: Event) {
    event.stopPropagation()
  }

  render () {

    const { lang, title, uuid, handleClick, handleClickMore } = this.props
    const contentIsURL = isURL(title)
    const path = `/node/${ uuid }`

    return (
      <div className="node-content" onClick={ handleClick }>
        <ButtonIcon type="MORE" lang={ lang } handleClick={ handleClickMore } />
        <span>
          { contentIsURL && <a href={ title }>{ title }</a> }
          { !contentIsURL && title }
          <Link to={ path } className="node-info" onClick={ this.handleClickInfo }>&#9432;</Link>
        </span>
      </div>
    )
  }
}

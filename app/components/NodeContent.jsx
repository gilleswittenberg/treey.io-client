/* @flow */

import type { Lang } from '../../flow/types'
import type { NodeId } from '../../flow/tree'

import React, { Component } from 'react'
import isURL from '../lib/utils/isURL'
import ButtonIcon from './ButtonIcon'
import DEFAULT_LANG from '../settings/DEFAULT_LANG'
import { Link } from 'react-router-dom'

type Props = {
  lang: Lang,
  title: string,
  uuid: NodeId,
  handleClick: any,
  handleClickMore: any
}

export default class NodeContent extends Component<Props> {

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

/* @flow */

import React, { Component } from 'react'
import classNames from 'classnames'
import __ from '../lib/utils/i18n'
import addImgSrc from '../images/add_64x64.png'
import submitImgSrc from '../images/submit_64x64.png'
import removeImgSrc from '../images/remove_64x64.png'
import dragImgSrc from '../images/drag_64x64.png'
import type { Lang } from '../../flow/types'

type Props = {
  type: 'ADD' | 'MOVE_CHILD' | 'DELETE' | 'EDIT' | 'MORE' | 'SAVE',
  lang: Lang,
  handleClick: (event: Event) => void,
  tabIndex?: number
}

export default class ButtonIcon extends Component<Props> {

  static defaultProps = {
    handleClick: (event: Event) => {} // eslint-disable-line no-unused-vars, no-empty-function
  }

  render () {
    const { type, lang, handleClick, tabIndex } = this.props
    const typeLowerCased = type.toLowerCase()
    const typeLowerCasedHyphenated = typeLowerCased.replace(/_/g, '-')
    const classNameType = `button-icon-${ typeLowerCasedHyphenated }`
    const className = classNames('button-icon', classNameType)
    const title = __(lang, type)
    const attr = { className, onClick: handleClick, title }
    const buttonAttr = tabIndex != null ? { ...attr, tabIndex } : attr

    let imgSrc
    switch (type) {
    case 'ADD':
      imgSrc = addImgSrc
      break
    case 'MOVE_CHILD':
    case 'MORE':
      imgSrc = dragImgSrc
      break
    case 'DELETE':
      imgSrc = removeImgSrc
      break
    case 'EDIT':
    case 'SAVE':
      imgSrc = submitImgSrc
      break
    default:
      break
    }

    const size = 21

    return (
      <button { ...buttonAttr }>
        <img src={ imgSrc } width={ size } height={ size } />
      </button>
    )
  }
}

/* @flow */

import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import __ from '../lib/utils/i18n'

const typesData = {
  ADD: { iconClass: 'fa-plus-square-o' },
  MOVE_CHILD: { iconClass: 'fa-plus-square-o' },
  DELETE: { iconClass: 'fa-trash-o' },
  EDIT: { iconClass: 'fa-pencil-square-o' },
  MORE: { iconClass: 'fa-ellipsis-v' },
  SAVE: { iconClass: 'fa-floppy-o' }
}
const types = Object.keys(typesData)

export default class ButtonIcon extends Component {

  static propTypes = {
    type: PropTypes.oneOf(types).isRequired,
    lang: PropTypes.string.isRequired,
    handleClick: PropTypes.func,
    tabIndex: PropTypes.number
  }

  static defaultProps = {
    handleClick: (event: Event) => {} // eslint-disable-line no-unused-vars
  }

  render () {
    const { type, lang, handleClick, tabIndex } = this.props
    const typeLowerCased = type.toLowerCase()
    const typeLowerCasedHyphenated = typeLowerCased.replace(/_/g, '-')
    const classNameType = `button-icon-${ typeLowerCasedHyphenated }`
    const className = classNames('button-icon', classNameType)
    const iconClass = typesData[type].iconClass
    const classNameIcon = classNames('fa', iconClass)
    const title = __(lang, type)
    const attr = { className, onClick: handleClick, title }
    const buttonAttr = tabIndex != null ? { ...attr, tabIndex } : attr

    return (
      <button { ...buttonAttr }>
        <i className={ classNameIcon }></i>
      </button>
    )
  }
}

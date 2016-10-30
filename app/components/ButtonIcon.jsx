/* @flow */

import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import __ from '../lib/i18n'

const typesData = {
  ADD: { iconClass: 'fa-plus-square-o' },
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
    handleClick: PropTypes.func
  }

  static defaultProps = {
    handleClick: (event: Event) => {} // eslint-disable-line no-unused-vars
  }

  render () {
    const { type, lang, handleClick } = this.props
    const typeLowerCased = type.toLowerCase()
    const classNameType = `button-icon-${ typeLowerCased }`
    const className = classNames('button-icon', classNameType)
    const iconClass = typesData[type].iconClass
    const classNameIcon = classNames('fa', iconClass)
    const title = __(lang, type)

    return (
      <button className={ className } onClick={ handleClick } title={ title }>
        <i className={ classNameIcon }></i>
      </button>
    )
  }
}

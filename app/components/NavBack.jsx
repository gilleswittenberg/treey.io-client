/* @flow */

// @TODO: Rename component

import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import __ from '../lib/utils/i18n'

export default class SignOutButton extends Component {

  static propTypes = {
    lang: PropTypes.string.isRequired
  }

  render () {

    const { lang } = this.props

    return (
      <nav>
        <Link to="/">{ __(lang, 'BACK') }</Link>
      </nav>
    )
  }
}

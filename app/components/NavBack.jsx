/* @flow */

// @TODO: Rename component

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
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

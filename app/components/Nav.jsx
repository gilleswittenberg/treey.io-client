/* @flow */

// @TODO: Rename component

import autobind from 'autobind-decorator'
import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import __ from '../lib/utils/i18n'

export default class SignOutButton extends Component {

  static propTypes = {
    lang: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    signOutFailed: PropTypes.bool.isRequired,
    postSignOut: PropTypes.func.isRequired
  }

  @autobind
  handleClickSignOut () {
    const { postSignOut } = this.props
    postSignOut()
  }

  render () {

    const { lang, username, signOutFailed } = this.props
    const sessionText = __(lang, 'SESSION')
    const signOutText = __(lang, 'SIGN_OUT')
    const signOutFailedText = __(lang, 'SIGN_OUT_FAILED')

    return (
      <nav>
        <p>{ username }</p>
        <Link to="/session">{ sessionText }</Link>
        <button className="sign-out-button" onClick={ this.handleClickSignOut }>{ signOutText }</button>
        { signOutFailed &&
          <p style={ { color: 'red' } }>{ signOutFailedText }</p>
        }
      </nav>
    )
  }
}

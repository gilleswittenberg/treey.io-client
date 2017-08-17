/* @flow */

import autobind from 'autobind-decorator'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import __ from '../lib/utils/i18n'
import logoImageSrc from '../images/logo_64x64.png'

export default class Nav extends Component {

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
        <div className="nav-col-left">
          <p>{ username }</p>
        </div>
        <img src={ logoImageSrc } width="32" height="32"></img>
        <div className="nav-col-right">
          <Link className="-is-hidden-small" to="/session">{ sessionText }</Link>
          <button className="sign-out-button" onClick={ this.handleClickSignOut }>{ signOutText }</button>
          { signOutFailed &&
            <p style={ { color: 'red' } }>{ signOutFailedText }</p>
          }
        </div>
      </nav>
    )
  }
}

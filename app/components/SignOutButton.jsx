/* @flow */

import autobind from 'autobind-decorator'
import React, { Component, PropTypes } from 'react'
import __ from '../lib/utils/i18n'

export default class SignOutButton extends Component {

  static propTypes = {
    lang: PropTypes.string,
    postSignOut: PropTypes.func.isRequired
  }

  @autobind
  handleClick () {
    const { postSignOut } = this.props
    postSignOut()
  }

  render () {

    const { lang } = this.props
    const signOutText = __(lang, 'SIGN_OUT')

    return (
      <button className="sign-out-button" onClick={ this.handleClick }>{ signOutText }</button>
    )
  }
}

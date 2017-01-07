/* @flow */

import autobind from 'autobind-decorator'
import React, { Component, PropTypes } from 'react'
import __ from '../lib/utils/i18n'

export default class LoginForm extends Component {

  static propTypes = {
    postAuthenticate: PropTypes.func.isRequired,
    authenticationFailed: PropTypes.bool.isRequired,
    lang: PropTypes.string.isRequired
  }

  state = {
    username: undefined,
    password: undefined
  }

  @autobind
  handleChange (event: Event) {
    const target = event.target
    if (target instanceof HTMLInputElement) {
      this.setState({ [target.name]: target.value })
    }
  }

  @autobind
  handleSubmit (event: Event) {
    event.preventDefault()
    const { postAuthenticate } = this.props
    const { username, password } = this.state
    postAuthenticate(username, password)
  }

  render () {

    const { authenticationFailed, lang } = this.props
    const authenticationFailedMessage = __(lang, 'AUTHENTICATION_FAILED_MESSAGE')
    const usernameText = __(lang, 'USERNAME')
    const passwordText = __(lang, 'PASSWORD')
    const loginText = __(lang, 'LOGIN')

    return (
      <div className="login-form-wrap">
        <form onSubmit={ this.handleSubmit }>
          <input type="text" name="username" onChange={ this.handleChange } placeholder={ usernameText } />
          <input type="password" name="password" onChange={ this.handleChange } placeholder={ passwordText } />
          { authenticationFailed && <p>{ authenticationFailedMessage }</p> }
          <input type="submit" value={ loginText } />
        </form>
      </div>
    )
  }
}

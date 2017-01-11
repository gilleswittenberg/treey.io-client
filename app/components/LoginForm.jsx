/* @flow */

import autobind from 'autobind-decorator'
import React, { Component, PropTypes } from 'react'
import __ from '../lib/utils/i18n'
import classNames from 'classnames'

export default class LoginForm extends Component {

  static propTypes = {
    postAuthenticate: PropTypes.func.isRequired,
    authenticationFailed: PropTypes.bool.isRequired,
    authenticationError: PropTypes.bool.isRequired,
    lang: PropTypes.string.isRequired
  }

  state = {
    username: undefined,
    password: undefined,
    usernameValid: undefined,
    passwordValid: undefined
  }

  @autobind
  setInputsValidity () {
    const { username, password } = this.state
    const usernameValid = username !== undefined && username.length > 2
    const passwordValid = password !== undefined && password.length > 8
    this.setState({ usernameValid, passwordValid })
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
    this.setInputsValidity()
    const { usernameValid, passwordValid } = this.state
    if (usernameValid && passwordValid) {
      const { postAuthenticate } = this.props
      const { username, password } = this.state
      postAuthenticate(username, password)
    }
  }

  render () {

    const { authenticationFailed, authenticationError, lang } = this.props
    const authenticationFailedMessage = __(lang, 'AUTHENTICATION_FAILED_MESSAGE')
    const authenticationErrorMessage = __(lang, 'AUTHENTICATION_ERROR_MESSAGE')
    const usernameText = __(lang, 'USERNAME')
    const passwordText = __(lang, 'PASSWORD')
    const loginText = __(lang, 'LOGIN')
    const { usernameValid, passwordValid } = this.state
    const usernameInputClassName = classNames({ '-is-invalid': usernameValid === false })
    const passwordInputClassName = classNames({ '-is-invalid': passwordValid === false })

    return (
      <div className="login-form-wrap">
        <form onSubmit={ this.handleSubmit }>
          <input type="text" name="username" className={ usernameInputClassName } onChange={ this.handleChange } placeholder={ usernameText } />
          <input type="password" name="password" className={ passwordInputClassName } onChange={ this.handleChange } placeholder={ passwordText } />
          { authenticationFailed && <p>{ authenticationFailedMessage }</p> }
          { authenticationError && <p>{ authenticationErrorMessage }</p> }
          <input type="submit" value={ loginText } />
        </form>
      </div>
    )
  }
}

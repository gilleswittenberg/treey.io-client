/* @flow */

import autobind from 'autobind-decorator'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import __ from '../lib/utils/i18n'
import classNames from 'classnames'
import validateUsername from '../lib/auth/validateUsername'
import validatePassword from '../lib/auth/validatePassword'

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
  setInputsValidity () : boolean {
    const { username, password } = this.state
    const usernameValid = validateUsername(username)
    const passwordValid = validatePassword(password)
    this.setState({ usernameValid, passwordValid })
    return usernameValid && passwordValid
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
    const valid = this.setInputsValidity()
    if (valid) {
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

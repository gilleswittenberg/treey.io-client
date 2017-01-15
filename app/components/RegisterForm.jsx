/* @flow */

import autobind from 'autobind-decorator'
import React, { Component, PropTypes } from 'react'
import __ from '../lib/utils/i18n'
import classNames from 'classnames'
import validateUsername from '../lib/auth/validateUsername'
import validatePassword from '../lib/auth/validatePassword'
import confirmPasswords from '../lib/auth/confirmPasswords'

export default class RegisterForm extends Component {

  static propTypes = {
    postRegister: PropTypes.func.isRequired,
    registrationFailed: PropTypes.bool.isRequired,
    registrationError: PropTypes.bool.isRequired,
    lang: PropTypes.string.isRequired
  }

  state = {
    username: undefined,
    password: undefined,
    passwordConfirm: undefined,
    usernameValid: undefined,
    passwordValid: undefined,
    passwordConfirmValid: undefined
  }

  @autobind
  setInputsValidity () : boolean {
    const { username, password, passwordConfirm } = this.state
    const usernameValid = validateUsername(username)
    const passwordValid = validatePassword(password)
    const passwordConfirmValid = confirmPasswords(password, passwordConfirm)
    this.setState({ usernameValid, passwordValid, passwordConfirmValid })
    return usernameValid && passwordValid && passwordConfirmValid
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
      const { postRegister } = this.props
      const { username, password, passwordConfirm } = this.state
      postRegister(username, password, passwordConfirm)
    }
  }

  render () {

    const { registerFailed, registerError, lang } = this.props
    const registerFailedMessage = __(lang, 'REGISTER_FAILED_MESSAGE')
    const registerErrorMessage = __(lang, 'REGISTER_ERROR_MESSAGE')
    const usernameText = __(lang, 'USERNAME')
    const passwordText = __(lang, 'PASSWORD')
    const passwordConfirmText = __(lang, 'PASSWORD_CONFIRM')
    const registerText = __(lang, 'REGISTER')
    const { usernameValid, passwordValid, passwordConfirmValid } = this.state
    const usernameInputClassName = classNames({ '-is-invalid': usernameValid === false })
    const passwordInputClassName = classNames({ '-is-invalid': passwordValid === false })
    const passwordConfirmInputClassName = classNames({ '-is-invalid': passwordConfirmValid === false })

    return (
      <div className="register-form-wrap">
        <form onSubmit={ this.handleSubmit }>
          <input type="text" name="username" className={ usernameInputClassName } onChange={ this.handleChange } placeholder={ usernameText } />
          <input type="password" name="password" className={ passwordInputClassName } onChange={ this.handleChange } placeholder={ passwordText } />
          <input type="password" name="passwordConfirm" className={ passwordConfirmInputClassName } onChange={ this.handleChange } placeholder={ passwordConfirmText } />
          { registerFailed && <p>{ registerFailedMessage }</p> }
          { registerError && <p>{ registerErrorMessage }</p> }
          <input type="submit" value={ registerText } />
        </form>
      </div>
    )
  }
}

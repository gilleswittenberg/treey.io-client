/* @flow */

import type { Dispatch, State } from '../../flow/types'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import getActions from '../lib/ui/actions'
import RegisterForm from '../components/RegisterForm'
import { Link } from 'react-router-dom'

type Props = {
  dispatch: Dispatch,
}
& State

class AuthRegister extends Component<Props> {

  render () {

    const {
      dispatch,
      app: { lang },
      user: {
        registrationFailed,
        registrationError
      }
    } = this.props

    const actions = getActions(dispatch)

    const registerFormProps = {
      postRegister: actions.postRegister,
      registrationFailed,
      registrationError,
      lang
    }

    return (
      <div className="wrap-narrow">
        <RegisterForm { ...registerFormProps } />
        <Link to="/login">login</Link>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({ ...props, ...state })
export default connect(mapStateToProps)(AuthRegister)

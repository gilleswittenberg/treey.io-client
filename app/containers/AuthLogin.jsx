/* @flow */

import type { Dispatch, State } from '../../flow/types'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import getActions from '../lib/ui/actions'
import LoginForm from '../components/LoginForm'
import { Redirect, Link } from 'react-router-dom'

type Props = {
  dispatch: Dispatch,
  location: any
}
& State

class AuthLogin extends Component<Props> {

  render () {

    const {
      dispatch,
      app: { lang },
      user: {
        loggedIn,
        authenticationFailed,
        authenticationError
      },
      location: {
        state: {
          from = { pathname: '/' }
        } = {}
      }
    } = this.props

    if (loggedIn === true) {
      return <Redirect to={ from } />
    }

    const actions = getActions(dispatch)

    const loginFormProps = {
      postAuthenticate: actions.postAuthenticate,
      authenticationFailed,
      authenticationError,
      lang
    }

    /* @TODO: Enable
    <Link to="/register">register</Link>
    */

    return (
      <div className="wrap-narrow">
        <LoginForm { ...loginFormProps } />
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({ ...props, ...state })
export default connect(mapStateToProps)(AuthLogin)

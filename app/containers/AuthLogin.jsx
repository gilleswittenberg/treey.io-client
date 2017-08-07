/* @flow */

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import getActions from '../lib/ui/actions'
import LoginForm from '../components/LoginForm'
import { Link } from 'react-router'

class AuthLogin extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    app: PropTypes.object.isRequired
  }

  render () {

    const {
      dispatch,
      app: { lang },
      user: {
        authenticationFailed,
        authenticationError
      }
    } = this.props

    const actions = getActions(dispatch)

    const loginFormProps = {
      postAuthenticate: actions.postAuthenticate,
      authenticationFailed,
      authenticationError,
      lang
    }

    return (
      <div className="wrap-narrow">
        <LoginForm { ...loginFormProps } />
        <Link to="/register">register</Link>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({ ...props, ...state })
export default connect(mapStateToProps)(AuthLogin)

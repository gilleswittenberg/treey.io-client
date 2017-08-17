/* @flow */

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import getActions from '../lib/ui/actions'
import RegisterForm from '../components/RegisterForm'
import { Link } from 'react-router-dom'

class AuthRegister extends React.Component {

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

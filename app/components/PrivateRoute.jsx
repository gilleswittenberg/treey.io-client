/* @flow */

import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import AuthInitializing from '../containers/AuthInitializing'

const renderHOF = (Component, loggedIn) =>
  props => { // eslint-disable-line react/display-name
    if (loggedIn === true) {
      return <Component { ...props } />
    } else if (loggedIn === false) {
      return <Redirect to={ { pathname: '/login', state: { from: props.location } } } /> // eslint-disable-line react/prop-types
    }
    return <AuthInitializing />
  }

// $FlowIssue Flow within destructuring
const PrivateRoute = ({ component: Component, ...rest }) => // eslint-disable-line react/prop-types
  <Route
    { ...rest }
    render={ renderHOF(Component, rest.loggedIn) }
  />

export default PrivateRoute

/* @flow */

import type { State } from '../../flow/types'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import PrivateRoute from '../components/PrivateRoute'
import App from './App'
import AuthLogin from './AuthLogin'
import AuthRegister from './AuthRegister'
import Session from './Session'
import Node from './Node'
import NoMatch from './NoMatch'

type Props = {} & State

class Root extends Component<Props> {

  render () {
    const { user: { loggedIn } } = this.props
    return (
      <BrowserRouter>
        <Switch>
          <PrivateRoute exact path="/" component={ App } loggedIn={ loggedIn } />
          <Route path="/login" component={ AuthLogin } />
          <Route path="/register" component={ AuthRegister } />
          <PrivateRoute path="/session" component={ Session } loggedIn={ loggedIn } />
          <PrivateRoute path="/node/:uuid" component={ Node } loggedIn={ loggedIn } />
          <Route component={ NoMatch } />
        </Switch>
      </BrowserRouter>
    )
  }
}

const mapStateToProps = (state, props) => ({ ...props, ...state })
export default connect(mapStateToProps)(Root)

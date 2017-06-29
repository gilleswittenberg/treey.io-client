import { Router, Route, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import React from 'react'
import App from './App'
import AuthLogin from './AuthLogin'
import AuthRegister from './AuthRegister'
import Session from './Session'

export default ({ store }) => {

  const state = store.getState()
  if (state.user.loggedIn === true) {
    browserHistory.push('/')
  } else if (state.user.loggedIn === false) {
    browserHistory.push('/login')
  }

  return (
    <Provider store={ store }>
      <Router history={ browserHistory }>
        <Route path="/" component={ App } />
        <Route path="/login" component={ AuthLogin } />
        <Route path="/register" component={ AuthRegister } />
        <Route path="/session" component={ Session } />
      </Router>
    </Provider>
  )
}

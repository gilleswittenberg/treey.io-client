/* @flow */

import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import getActions from '../lib/ui/actions'
import LoginForm from '../components/LoginForm'
import SignOutButton from '../components/SignOutButton'
import ServerStatus from '../components/ServerStatus'
import Tree from '../components/Tree'

class App extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    nodes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    app: PropTypes.object.isRequired
  }

  render () {

    const {
      dispatch,
      app,
      app: { lang, enableDnD },
      user: {
        loggedIn,
        username,
        authenticationFailed,
        authenticationError,
        signOutFailed
      },
      nodes: { tree, isSyncing, hasErrors }
    } = this.props

    const actions = getActions(dispatch)

    const loginFormProps = {
      postAuthenticate: actions.postAuthenticate,
      authenticationFailed,
      authenticationError,
      lang
    }
    const signOutButtonProps = { lang, username, signOutFailed, postSignOut: actions.postSignOut }
    const serverStatusProps = { lang, hasErrors, isSyncing }

    // $FlowIssue Flow does not recognize Tree.DecoratedComponent
    const TreeComponent = enableDnD ? Tree : Tree.DecoratedComponent
    const treeProps = { lang, enableDnD, app, tree, ...actions }

    const showLoginForm = loggedIn === false
    const showTree = loggedIn === true
    const showServerStatus = showTree
    const showSignOutButton = showTree

    return (
      <div className="wrap">
        { showLoginForm &&
          <LoginForm { ...loginFormProps } />
        }
        { showSignOutButton &&
          <SignOutButton { ...signOutButtonProps }/>
        }
        { showServerStatus &&
          <ServerStatus { ...serverStatusProps } />
        }
        { showTree &&
          <TreeComponent { ...treeProps } />
        }
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({ ...props, ...state })
export default connect(mapStateToProps)(App)

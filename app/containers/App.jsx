/* @flow */

import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import getActions from '../lib/ui/actions'
import Nav from '../components/Nav'
import ServerStatus from '../components/ServerStatus'
import Tree from '../components/Tree'

class App extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    app: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    nodes: PropTypes.object.isRequired,
    ui: PropTypes.object.isRequired
  }

  render () {

    const {
      dispatch,
      app,
      app: { lang, enableDnD },
      user: {
        username,
        loggedIn,
        signOutFailed
      },
      // @TODO: Rename nodesArray to nodes
      nodes: { tree, nodes: nodesArray, isSyncing, hasErrors, treeIndices },
      ui
    } = this.props

    const actions = getActions(dispatch)

    const navProps = { lang, username, signOutFailed, postSignOut: actions.postSignOut }
    const serverStatusProps = { lang, hasErrors, isSyncing }

    // $FlowIssue Flow does not recognize Tree.DecoratedComponent
    const TreeComponent = enableDnD ? Tree : Tree.DecoratedComponent
    const treeProps = { lang, enableDnD, app, tree, ui, nodesArray, treeIndices, ...actions }

    return (
      <div className="wrap-narrow">
        { loggedIn &&
          <Nav { ...navProps } />
        }
        { loggedIn &&
          <ServerStatus { ...serverStatusProps } />
        }
        { loggedIn &&
          <TreeComponent { ...treeProps } />
        }
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({ ...props, ...state })
export default connect(mapStateToProps)(App)

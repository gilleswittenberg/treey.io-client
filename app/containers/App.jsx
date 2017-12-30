/* @flow */

import type { Dispatch, State } from '../../flow/types'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import getActions from '../lib/ui/actions'
import Nav from '../components/Nav'
import ServerStatus from '../components/ServerStatus'
import Tree from '../components/Tree'

type Props = {
  dispatch: Dispatch
} & State

class App extends Component<Props> {

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
      nodes: { nodes: nodesArray, isSyncing, hasErrors },
      ui
    } = this.props

    const actions = getActions(dispatch)

    const navProps = { lang, username, signOutFailed, postSignOut: actions.postSignOut }
    const serverStatusProps = { lang, hasErrors, isSyncing }

    // $FlowIssue Flow does not recognize Tree.DecoratedComponent
    const treeProps = { lang, enableDnD, app, ui, nodesArray, ...actions }

    return (
      <div className="wrap-narrow">
        { loggedIn &&
          <Nav { ...navProps } />
        }
        { loggedIn &&
          <ServerStatus { ...serverStatusProps } />
        }
        { loggedIn &&
          <Tree { ...treeProps } />
        }
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({ ...props, ...state })
export default connect(mapStateToProps)(App)

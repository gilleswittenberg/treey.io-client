/* @flow */

import type { Dispatch, State } from '../../flow/types'

import React, { Component } from 'react'
//import { connect } from 'react-redux'
import connect from '../modules/treey-react/connect'
import getActions from '../lib/ui/getActions'
import Nav from '../components/Nav'
import ServerStatus from '../components/ServerStatus'
import Tree from '../components/Tree'

type Props = {
  dispatch: Dispatch,
  tree: [],
  dataAdd: Function,
  dataRemove: Function,
  add: Function,
  update: Function,
  remove: Function,
  move: Function
} & State

class App extends Component<Props> {

  render () {

    const {
      //dispatch,
      app,
      app: { lang, enableDnD },
      user: {
        username,
        loggedIn,
        signOutFailed
      },
      // @TODO: Rename nodesArray to nodes
      //nodes: { nodes: nodesArray, isSyncing, hasErrors },
      tree,
      add,
      update,
      remove,
      move,
      dataAdd,
      dataRemove,
      ui
    } = this.props
    const isSyncing = false
    const hasErrors = false

    const actions = getActions(dataAdd, dataRemove)

    const navProps = { lang, username, signOutFailed, postSignOut: actions.postSignOut }
    const serverStatusProps = { lang, hasErrors, isSyncing }

    // $FlowIssue Flow does not recognize Tree.DecoratedComponent
    //const treeProps = { lang, enableDnD, app, ui, nodesArray, ...actions }
    const treeProps = { lang, enableDnD, app, ui, add, update, remove, move, tree, ...actions }

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

//const mapStateToProps = (state, props) => ({ ...props, ...state })
//export default connect(mapStateToProps)(App)
const dataToProps = {
  app: 'app',
  user: 'user',
  ui: 'ui'
}
export default connect(App, undefined, undefined, dataToProps)

/* @flow */

import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import getActions from '../lib/ui/actions'
import ServerStatus from '../components/ServerStatus'
import Tree from '../components/Tree'

class App extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    nodes: PropTypes.object.isRequired,
    app: PropTypes.object.isRequired
  }

  render () {

    const {
      dispatch,
      app,
      app: { lang, enableDnD },
      nodes: { tree, isSyncing, hasErrors }
    } = this.props

    const actions = getActions(dispatch)

    const serverStatusProps = { lang, hasErrors, isSyncing }

    // $FlowIssue Flow does not recognize Tree.DecoratedComponent
    const TreeComponent = enableDnD ? Tree : Tree.DecoratedComponent
    const treeProps = { lang, enableDnD, app, tree, ...actions }

    return (
      <div className="wrap">
        <ServerStatus { ...serverStatusProps } />
        <TreeComponent { ...treeProps } />
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({ ...props, ...state })
export default connect(mapStateToProps)(App)

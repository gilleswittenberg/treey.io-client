/* @flow */

import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import getActions from '../lib/actions'
import ServerStatus from '../components/ServerStatus'
import TreeDecorated, { Tree } from '../components/Tree'

class App extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    nodes: PropTypes.object.isRequired,
    ui: PropTypes.object.isRequired
  }

  render () {

    const {
      dispatch,
      ui,
      ui: { lang, enableDnD },
      nodes: { tree, isSyncing, hasErrors }
    } = this.props

    const actions = getActions(dispatch)

    const serverStatusProps = { lang, hasErrors, isSyncing }

    const TreeComponent = enableDnD ? TreeDecorated : Tree
    const treeProps = { lang, enableDnD, ui, tree, ...actions }

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

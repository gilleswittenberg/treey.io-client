/* @flow */

import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import getActions from '../lib/actions'
import ServerStatus from '../components/ServerStatus'
import Tree from '../components/Tree'

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
      ui: { lang },
      nodes: { tree, isSyncing, hasErrors }
    } = this.props

    const actions = getActions(dispatch)

    return (
      <div className="wrap">
        <ServerStatus
          lang={ lang }
          hasErrors={ hasErrors }
          isSyncing={ isSyncing }
        />
        <Tree ui={ ui } actions={ actions } tree={ tree } />
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({ ...props, ...state })
export default connect(mapStateToProps)(App)

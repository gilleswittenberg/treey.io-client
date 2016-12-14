import React from 'react'
import ReactDOM from 'react-dom'
import Root from './containers/Root.jsx'
import configureStore from './store/configureStore'
import { getNodes } from './actions/nodes'
// @TODO: fix expanded
// import Storage from './lib/utils/Storage'
// import EXPANDED_KEY from './settings/EXPANDED_KEY'
import ROOT_UID from './settings/ROOT_UID'

import '!style!css!./css/font-awesome.css'
import '!style!css!sass!./css/screen.sass'

const store = configureStore()

// @TODO: fix expanded
// const expanded = Storage.get(EXPANDED_KEY, 'string[]')

store.dispatch(getNodes(ROOT_UID))

ReactDOM.render(
  <Root store={ store } />,
  document.getElementById('root')
)

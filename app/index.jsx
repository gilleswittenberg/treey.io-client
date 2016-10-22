import React from 'react'
import ReactDOM from 'react-dom'
import Root from './containers/Root.jsx'
import configureStore from './store/configureStore'
import { getNodes } from './actions/nodes'
import { init as initUI } from './actions/ui'

import '!style!css!./css/font-awesome.css'
import '!style!css!sass!./css/screen.sass'

const store = configureStore()

store.dispatch(initUI())

const uid = '57bedc40e81b0620300d769a'
store.dispatch(getNodes(uid))

ReactDOM.render(
  <Root store={ store } />,
  document.getElementById('root')
)

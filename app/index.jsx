import React from 'react'
import ReactDOM from 'react-dom'
import Root from './containers/Root.jsx'
import configureStore from './store/configureStore'
import { getNodes } from './actions/nodes.js'

import 'style!./main.css'

const store = configureStore()

store.dispatch(getNodes())

ReactDOM.render(
  <Root store={ store } />,
  document.getElementById('root')
)

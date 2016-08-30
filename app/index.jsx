import React from 'react'
import ReactDOM from 'react-dom'
import Root from './containers/Root.jsx'
import configureStore from './store/configureStore'
import { getNodes } from './actions/nodes'

import '!style!css!sass!./main.sass'

const store = configureStore()

store.dispatch(getNodes())

ReactDOM.render(
  <Root store={ store } />,
  document.getElementById('root')
)

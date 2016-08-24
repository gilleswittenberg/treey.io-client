import React from 'react'
import ReactDOM from 'react-dom'
import Root from './containers/Root.jsx'
import configureStore from './store/configureStore'

import 'style!./main.css'

const store = configureStore()

ReactDOM.render(
  <Root store={ store } />,
  document.getElementById('root')
)

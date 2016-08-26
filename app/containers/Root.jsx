import React from 'react'
import { Provider } from 'react-redux'
import App from './App.jsx'

export default ({ store }) =>
  <Provider store={ store }>
    <div>
      <App dispatch={ store.dispatch }/>
    </div>
  </Provider>

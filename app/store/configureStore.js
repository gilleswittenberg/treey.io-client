/* @flow */

import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'

import type { State } from '../../flow/types'

const createStoreWithMiddleware = compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)

export default function configureStore (initialState: State) {

  const store = createStoreWithMiddleware(rootReducer, initialState)
  const module: any = module

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers/index').default
      store.replaceReducer(nextReducer)
    })
  }

  return store
}

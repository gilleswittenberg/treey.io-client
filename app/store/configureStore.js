import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import multi from 'redux-multi'
import rootReducer from '../reducers'

const createStoreWithMiddleware = compose(
  applyMiddleware(thunk, multi),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)

export default function configureStore (initialState) {

  const store = createStoreWithMiddleware(rootReducer, initialState)

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      // @TODO: delete: const nextReducer = require('../reducers/index').default
      store.replaceReducer(rootReducer)
    })
  }

  return store
}

import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
//import { createStore, compose } from 'redux'
//import { persistState } from 'redux-devtools'
import rootReducer from '../reducers'

const createStoreWithMiddleware = compose(
  applyMiddleware(thunk)
)(createStore)

export default function configureStore (initialState) {
  const store = createStoreWithMiddleware(rootReducer, initialState)

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers/index').default
      store.replaceReducer(nextReducer)
    })
  }

  return store
}

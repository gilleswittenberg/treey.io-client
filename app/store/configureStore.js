import { createStore } from 'redux'
//import { createStore, compose } from 'redux'
//import { persistState } from 'redux-devtools'
import rootReducer from '../reducers'

/*
const createStoreWithMiddleware = compose(
  persistState(getDebugSessionKey())
)(createStore)
*/

export default function configureStore (initialState) {
  //const store = createStoreWithMiddleware (rootReducer, initialState)
  const store = createStore(rootReducer, initialState)

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers/index').default
      store.replaceReducer(nextReducer)
    })
  }

  return store
}

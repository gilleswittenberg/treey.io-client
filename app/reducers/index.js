/* @flow */

import { combineReducers } from 'redux'
import nodes from './nodes'
import app from './app'

export default combineReducers({
  nodes,
  app
})

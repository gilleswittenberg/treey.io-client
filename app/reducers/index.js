/* @flow */

import { combineReducers } from 'redux'
import app from './app'
import nodes from './nodes'
import user from './user'

export default combineReducers({
  app,
  nodes,
  user
})

/* @flow */

import { combineReducers } from 'redux'
import app from './app'
import user from './user'
import nodes from './nodes'
import ui from './ui'

export default combineReducers({
  app,
  user,
  nodes,
  ui
})

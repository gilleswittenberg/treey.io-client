import { combineReducers } from 'redux'
import nodes from './nodes'
import ui from './ui'

export default combineReducers({
  nodes,
  ui
})

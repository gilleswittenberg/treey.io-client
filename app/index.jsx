/* @flow */

import React from 'react'
import ReactDOM from 'react-dom'
import Provider from './modules/treey-react/Provider'
import defaultData from './defaultData'
//import { Provider } from 'react-redux'
import Root from './containers/Root'
//import configureStore from './store/configureStore'
//import { getUser } from './actions/user'
// @TODO: fix merging tree for expanded key from localStorage
/*
- import Storage from './lib/utils/Storage'
- import EXPANDED_KEY from './settings/EXPANDED_KEY'
*/

import '!style-loader!css-loader!sass-loader!./css/screen.sass'

//const store = configureStore()

// @TODO: fix merging tree for expanded key from localStorage
// - const expanded = Storage.get(EXPANDED_KEY, 'string[]')

//store.dispatch(getUser())

const defaultRootData = { title: 'Not signed in' }
const elem = document.getElementById('root')
const initCallback = treey => {
  const rootId = treey.root.ids[0]
  const treePath = [rootId]
  treey.dataAdd({ ui: { expanded: [treePath], active: treePath } })
}
if (elem != null) {
  ReactDOM.render(
    <Provider defaultData={ defaultData } defaultRootData={ defaultRootData } initCallback={ initCallback }>
      <Root/>
    </Provider>,
    elem
  )
}

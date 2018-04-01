import PropTypes from 'prop-types'
import React, { Component } from 'react'

const treeyProps = [
  'data',
  'nodes',
  'root',
  'tree'
]

const treeyActions = [
  'dataAdd',
  'dataRemove',
  'add',
  'update',
  'remove',
  'move'
]

function stateProps (treey, props = treeyProps) {
  return props.reduce((obj, key) => {
    obj[key] = treey[key]
    return obj
  }, {})
}

function elementProps (treey, props = treeyProps, actions = treeyActions, dataToProps) {
  const arr = props.concat(actions)
  return arr.reduce((obj, key) => {
    if (key === 'data' && dataToProps != null) {
      const data = treey.data
      Object.keys(dataToProps).forEach(dataKey => {
        const propsKey = dataToProps[dataKey]
        obj[propsKey] = data[dataKey]
      })
    } else {
      obj[key] = treey[key]
      if (typeof obj[key] === 'function') {
        obj[key] = obj[key].bind(treey)
      }
    }
    return obj
  }, {})
}

export default function connect (WrappedComponent, props, actions, dataToProps) {

  class ConnectedComponent extends Component {

    observerIndex = undefined

    componentWillMount () {
      const { treey } = this.context
      treey.addObservers(this.setTreeyState.bind(this))
    }

    componentWillUnmount () {
      const { treey } = this.context
      treey.removeObservers(this.observerIndex)
    }

    setTreeyState () {
      const { treey } = this.context
      this.setState(stateProps(treey, props))
    }

    render () {
      const { treey } = this.context
      const propsObj = elementProps(treey, props, actions, dataToProps)
      return <WrappedComponent { ...propsObj } />
    }
  }

  ConnectedComponent.contextTypes = {
    treey: PropTypes.object.isRequired
  }

  return ConnectedComponent
}

import { Component, Children } from 'react'
import PropTypes from 'prop-types'
import TreeyBrowser from '../treey/TreeyBrowser'

class Provider extends Component {

  constructor (props) {
    super(props)
    this.treey = new TreeyBrowser()
    // @TODO: Only for debugging
    window.treey = this.treey
    const { defaultData, defaultRootData, initCallback } = props
    if (defaultData != null) {
      this.treey.dataAdd(defaultData)
    }
    this.treey.init().then(() => {
      const f = initCallback || function () {
        // Noop
      }
      if (this.treey.tree == null && defaultRootData != null) {
        this.treey.add(null, null, defaultRootData).then(() => f(this.treey))
      } else {
        f(this.treey)
      }
    })
  }

  getChildContext () {
    return { treey: this.treey }
  }

  render () {
    return Children.only(this.props.children)
  }
}

Provider.propTypes = {
  children: PropTypes.object,
  defaultData: PropTypes.object,
  defaultRootData: PropTypes.object,
  initCallback: PropTypes.func
}

Provider.childContextTypes = {
  treey: PropTypes.object
}

export default Provider

import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'

class App extends React.Component {
  render() {
    return (
      <div>
        <p>App</p>
      </div>
    )
  }
}

export default compose(
  connect(() => ({}), {})
)(App)

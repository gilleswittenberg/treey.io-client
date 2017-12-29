/* @flow */

// Required for Flow type
declare var describe: any
declare var it: any
declare var expect: any

import PrivateRoute from '../../app/components/PrivateRoute'
import { shallow } from 'enzyme'
import getComponentHOF from '../getComponent'
import AuthInitializing from '../../app/containers/AuthInitializing'
import { Component } from 'React'

describe('PrivateRoute', () => {

  const defaultProps = { loggedIn: null, exact: true, path: '/', component: Component }
  const getComponent = getComponentHOF(PrivateRoute, defaultProps)

  describe('loggedIn', () => {

    it('null', () => {
      const wrapper = shallow(getComponent({ loggedIn: null }))
      expect(wrapper.find('Route')).toHaveLength(1)
      expect(wrapper.find('Route').getElements()[0].props.render().type).toEqual(AuthInitializing)
    })


    it('false', () => {
      const wrapper = shallow(getComponent({ loggedIn: false }))
      expect(wrapper.find('Route')).toHaveLength(1)
      // @TODO: Test Redirect is rendered
    })

    it('true', () => {
      const wrapper = shallow(getComponent({ loggedIn: true }))
      expect(wrapper.find('Route')).toHaveLength(1)
      expect(wrapper.find('Route').getElements()[0].props.render().type).toEqual(Component)
    })
  })
})

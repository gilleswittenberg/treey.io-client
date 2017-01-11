/* @flow */

// required for Flow type
declare var describe: any
declare var it: any
declare var expect: any
declare var jest: any

import LoginForm from '../../app/components/LoginForm'
import { shallow } from 'enzyme'
import getComponentHOF from '../getComponent'
import noop from '../noop'
import getMockEvent from '../getMockEvent'

describe('LoginForm', () => {

  const lang = 'en'
  const defaultProps = {
    lang,
    postAuthenticate: noop,
    authenticationFailed: false,
    authenticationError: false
  }
  const getComponent = getComponentHOF(LoginForm, defaultProps)

  describe('change', () => {

    it('username', () => {
      const wrapper = shallow(getComponent())
      const input = document.createElement('input')
      input.setAttribute('name', 'username')
      input.value = 'johndoe'
      const mockEvent = getMockEvent({ target: input })
      wrapper.find('input[name="username"]').simulate('change', mockEvent)
      expect(wrapper.state().username).toBe('johndoe')
    })

    it('password', () => {
      const wrapper = shallow(getComponent())
      const input = document.createElement('input')
      input.setAttribute('name', 'password')
      input.value = 'hardcoded'
      const mockEvent = getMockEvent({ target: input })
      wrapper.find('input[name="password"]').simulate('change', mockEvent)
      expect(wrapper.state().password).toBe('hardcoded')
    })
  })

  describe('sumbit', () => {

    it('postAuthenticate', () => {
      const postAuthenticate = jest.fn()
      const wrapper = shallow(getComponent({ postAuthenticate }))
      const mockEvent = getMockEvent()
      wrapper.find('form').simulate('submit', mockEvent)
      expect(postAuthenticate.mock.calls.length).toBe(1)
    })
  })
})

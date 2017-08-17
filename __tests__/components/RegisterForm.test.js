/* @flow */

// Required for Flow type
declare var describe: any
declare var it: any
declare var expect: any
declare var jest: any

import RegisterForm from '../../app/components/RegisterForm'
import { shallow } from 'enzyme'
import getComponentHOF from '../getComponent'
import noop from '../noop'
import getMockEvent from '../getMockEvent'

describe('RegisterForm', () => {

  const lang = 'en'
  const defaultProps = {
    lang,
    postRegister: noop,
    registrationFailed: false,
    registrationError: false
  }
  const getComponent = getComponentHOF(RegisterForm, defaultProps)

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

    it('passwordConfirm', () => {
      const wrapper = shallow(getComponent())
      const input = document.createElement('input')
      input.setAttribute('name', 'password')
      input.value = 'hardcoded'
      const mockEvent = getMockEvent({ target: input })
      wrapper.find('input[name="passwordConfirm"]').simulate('change', mockEvent)
      expect(wrapper.state().password).toBe('hardcoded')
    })
  })

  describe('submit', () => {

    it('invalid inputs', () => {
      const wrapper = shallow(getComponent())
      const mockEvent = getMockEvent()
      wrapper.find('form').simulate('submit', mockEvent)
      expect(wrapper.state().usernameValid).toBe(false)
      expect(wrapper.state().passwordValid).toBe(false)
      expect(wrapper.state().passwordConfirmValid).toBe(false)
    })

    it('postSignup', () => {
      const postRegister = jest.fn()
      const wrapper = shallow(getComponent({ postRegister }))
      const mockEvent = getMockEvent()
      wrapper.setState({ username: 'johndoe', password: '12345678', passwordConfirm: '12345678' })
      wrapper.find('form').simulate('submit', mockEvent)
      expect(postRegister.mock.calls).toHaveLength(1)
    })
  })
})

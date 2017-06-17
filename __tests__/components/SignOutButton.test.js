/* @flow */

// Required for Flow type
declare var describe: any
declare var it: any
declare var expect: any
declare var jest: any

import SignOutButton from '../../app/components/SignOutButton'
import { shallow } from 'enzyme'
import getComponentHOF from '../getComponent'
import noop from '../noop'
import getMockEvent from '../getMockEvent'

describe('SignOutButton', () => {

  const lang = 'en'
  const defaultProps = {
    lang,
    username: '',
    postSignOut: noop,
    signOutFailed: false
  }
  const getComponent = getComponentHOF(SignOutButton, defaultProps)

  describe('click', () => {

    it('postSignOut', () => {
      const postSignOut = jest.fn()
      const wrapper = shallow(getComponent({ postSignOut }))
      const mockEvent = getMockEvent()
      wrapper.find('button').simulate('click', mockEvent)
      expect(postSignOut.mock.calls.length).toBe(1)
    })
  })
})

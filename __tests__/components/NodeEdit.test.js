/* @flow */

// Required for Flow type
declare var describe: any
declare var it: any
declare var expect: any
declare var jest: any

import NodeEdit from '../../app/components/NodeEdit'
import { shallow } from 'enzyme'
import getComponentHOF from '../getComponent'
import noop from '../noop'
import getMockEvent from '../getMockEvent'
import { parent, uuid } from '../uuid'

describe('NodeEdit', () => {

  const lang = 'en'
  const defaultProps = {
    lang,
    parent,
    uuid,
    treePath: [parent, uuid],
    title: '',
    clearUIEditingAdding: noop,
    update: noop,
    remove: noop
  }
  const getComponent = getComponentHOF(NodeEdit, defaultProps)

  it('change', () => {
    const wrapper = shallow(getComponent())
    const input = document.createElement('input')
    input.value = 'user input'
    const mockEvent = getMockEvent({ target: input })
    wrapper.find('input').simulate('change', mockEvent)
    expect(wrapper.state().title).toEqual('user input')
  })

  describe('componentWillReceiveProps', () => {

    it('new title', () => {
      const wrapper = shallow(getComponent({ title: 'one' }))
      wrapper.setProps({ title: 'new title' })
      expect(wrapper.state().title).toEqual('new title')
    })
  })

  it('tabIndex', () => {
    const wrapper = shallow(getComponent())
    expect(wrapper.find('input').props().tabIndex).toBe('1')
    expect(wrapper.find('ButtonIcon').props().tabIndex).toBe(2)
  })

  describe('submit', () => {

    it('remove', () => {
      const clearUIEditingAdding = jest.fn()
      const remove = jest.fn()
      const wrapper = shallow(getComponent({ clearUIEditingAdding, remove }))
      const mockEvent = getMockEvent()
      wrapper.find('form').simulate('submit', mockEvent)
      expect(clearUIEditingAdding.mock.calls).toHaveLength(1)
      expect(remove.mock.calls).toHaveLength(1)
    })

    it('update', () => {
      const clearUIEditingAdding = jest.fn()
      const update = jest.fn()
      const wrapper = shallow(getComponent({ clearUIEditingAdding, update }))
      wrapper.setState({ title: 'user input' })
      const mockEvent = getMockEvent()
      wrapper.find('form').simulate('submit', mockEvent)
      expect(clearUIEditingAdding.mock.calls).toHaveLength(1)
      expect(update.mock.calls).toHaveLength(1)
      expect(update.mock.calls[0][1]).toEqual({ title: 'user input' })
    })
  })
})

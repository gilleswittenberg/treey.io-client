/* @flow */

// required for Flow type
declare var describe: any
declare var it: any
declare var expect: any
declare var jest: any

import NodeEdit from '../../app/components/NodeEdit'
import { shallow } from 'enzyme'
import getComponentHOF from '../getComponent'
import noop from '../noop'
import getMockEvent from '../getMockEvent'
import { parent, uid } from '../uid'

describe('NodeEdit', () => {

  const lang = 'en'
  const defaultProps = {
    lang,
    parent,
    uid,
    title: '',
    clearUIEditingAdding: noop,
    putNode: noop,
    deleteNode: noop
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

  describe('sumbit', () => {

    it('deleteNode', () => {
      const clearUIEditingAdding = jest.fn()
      const deleteNode = jest.fn()
      const wrapper = shallow(getComponent({ clearUIEditingAdding, deleteNode }))
      const mockEvent = getMockEvent()
      wrapper.find('form').simulate('submit', mockEvent)
      expect(clearUIEditingAdding.mock.calls.length).toBe(1)
      expect(deleteNode.mock.calls.length).toBe(1)
    })

    it('putNode', () => {
      const clearUIEditingAdding = jest.fn()
      const putNode = jest.fn()
      const wrapper = shallow(getComponent({ clearUIEditingAdding, putNode }))
      wrapper.setState({ title: 'user input' })
      const mockEvent = getMockEvent()
      wrapper.find('form').simulate('submit', mockEvent)
      expect(clearUIEditingAdding.mock.calls.length).toBe(1)
      expect(putNode.mock.calls.length).toBe(1)
      expect(putNode.mock.calls[0][1]).toEqual({ title: 'user input' })
    })
  })
})

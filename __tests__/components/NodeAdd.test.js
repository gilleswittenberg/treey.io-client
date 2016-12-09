/* @flow */

// @TODO: clean up
declare var describe: any
declare var it: any
declare var expect: any
declare var jest: any

import NodeAdd from '../../app/components/NodeAdd'
import { shallow } from 'enzyme'
import getComponentHOF from '../getComponent'
import noop from '../noop'
import getMockEvent from '../getMockEvent'

describe('NodeAdd', () => {

  const lang = 'en'
  const parent = '57bedc40e81b0620300d769a'

  const defaultProps = {
    lang,
    parent,
    path: [],
    ui: {},
    clearNodeUI: noop,
    updateNodeUI: noop,
    postNode: noop
  }
  const getComponent = getComponentHOF(NodeAdd, defaultProps)

  describe('editing', () => {

    it('false', () => {
      const wrapper = shallow(getComponent())
      expect(wrapper.render().find('input').length).toBe(0)
    })

    it('true', () => {
      const wrapper = shallow(getComponent({ ui: { adding: true } }))
      expect(wrapper.render().find('input').length).toBe(1)
    })
  })

  describe('state title', () => {

    it('clear on isEditing change', () => {

      const wrapper = shallow(getComponent())
      wrapper.setState({ title: 'user input' })
      expect(wrapper.state().title).toBe('user input')
      wrapper.setProps({ ui: { adding: true } })
      expect(wrapper.state().title).toBe('')
    })
  })

  describe('input', () => {

    it('change', () => {
      const wrapper = shallow(getComponent({ ui: { adding: true } }))
      const input = document.createElement('input')
      input.value = 'user input'
      const mockEvent = getMockEvent({ target: input })
      wrapper.find('input').simulate('change', mockEvent)
      expect(wrapper.state().title).toEqual('user input')
    })

    describe('componentWillReceiveProps', () => {

      it('true => false', () => {
        const wrapper = shallow(getComponent({ ui: { adding: true } }))
        wrapper.setState({ title: 'blabla' })
        wrapper.setProps({ ui: { adding: false } })
        expect(wrapper.state().title).toEqual('')
      })

      it('false => true', () => {
        const wrapper = shallow(getComponent({ ui: { adding: false } }))
        wrapper.setState({ title: 'blabla' })
        wrapper.setProps({ ui: { adding: true } })
        expect(wrapper.state().title).toEqual('')
      })
    })

    describe('submit', () => {

      it('input', () => {

        const clearNodeUI = jest.fn()
        const postNode = jest.fn()
        const updateNodeUI = jest.fn()
        const wrapper = shallow(getComponent({ ui: { adding: true }, clearNodeUI, postNode, updateNodeUI }))

        wrapper.setState({ title: 'user input' })
        const mockEvent = getMockEvent()
        wrapper.find('form').simulate('submit', mockEvent)
        // @TODO: test arguments
        expect(clearNodeUI.mock.calls.length).toBe(2)
        expect(postNode.mock.calls.length).toBe(1)
        expect(postNode.mock.calls[0][2]).toEqual({ title: 'user input' })
        expect(updateNodeUI.mock.calls.length).toBe(1)
      })

      it('empty (whitespace) input', () => {

        const clearNodeUI = jest.fn()
        const postNode = jest.fn()
        const updateNodeUI = jest.fn()
        const wrapper = shallow(getComponent({ ui: { adding: true }, clearNodeUI, postNode }))

        wrapper.setState({ title: ' ' })
        const mockEvent = getMockEvent()
        wrapper.find('form').simulate('submit', mockEvent)
        // @TODO: test arguments
        expect(clearNodeUI.mock.calls.length).toBe(2)
        expect(postNode.mock.calls.length).toBe(0)
        expect(updateNodeUI.mock.calls.length).toBe(0)
      })
    })
  })
})

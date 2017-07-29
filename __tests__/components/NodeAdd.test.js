/* @flow */

// Required for Flow type
declare var describe: any
declare var it: any
declare var expect: any
declare var jest: any

import NodeAdd from '../../app/components/NodeAdd'
import { shallow } from 'enzyme'
import getComponentHOF from '../getComponent'
import noop from '../noop'
import getMockEvent from '../getMockEvent'
import { uuid } from '../uuid'
import defaultUI from '../../app/lib/ui/defaultUI'

describe('NodeAdd', () => {

  const lang = 'en'
  const parent = uuid
  const ui = defaultUI

  const defaultProps = {
    lang,
    parent,
    treePath: [uuid],
    ui,
    clearUIEditingAdding: noop,
    setUIEditing: noop,
    setUIAdding: noop,
    setUIExpanded: noop,
    create: noop
  }
  const getComponent = getComponentHOF(NodeAdd, defaultProps)

  describe('adding', () => {

    it('false', () => {
      const wrapper = shallow(getComponent())
      expect(wrapper.render().find('input').length).toBe(0)
    })

    it('true', () => {
      const wrapper = shallow(getComponent({ ui: { adding: [uuid] } }))
      expect(wrapper.render().find('input').length).toBe(1)
    })
  })

  describe('state title', () => {

    it('clear on isEditing change', () => {

      const wrapper = shallow(getComponent())
      wrapper.setState({ title: 'user input' })
      expect(wrapper.state().title).toBe('user input')
      wrapper.setProps({ ui: { adding: [uuid] } })
      expect(wrapper.state().title).toBe('')
    })
  })

  describe('tabIndex', () => {

    it('component props', () => {
      const wrapper = shallow(getComponent({ ui: { adding: [uuid] } }))
      expect(wrapper.find('input').props().tabIndex).toBe('1')
      expect(wrapper.find('ButtonIcon').props().tabIndex).toBe(2)
    })
  })

  describe('input', () => {

    it('change', () => {
      const wrapper = shallow(getComponent({ ui: { adding: [uuid] } }))
      const input = document.createElement('input')
      input.value = 'user input'
      const mockEvent = getMockEvent({ target: input })
      wrapper.find('input').simulate('change', mockEvent)
      expect(wrapper.state().title).toEqual('user input')
    })

    describe('componentWillReceiveProps', () => {

      it('true => false', () => {
        const wrapper = shallow(getComponent({ ui: { adding: [uuid] } }))
        wrapper.setState({ title: 'blabla' })
        wrapper.setProps({ ui: { adding: null } })
        expect(wrapper.state().title).toEqual('')
      })

      it('false => true', () => {
        const wrapper = shallow(getComponent())
        wrapper.setState({ title: 'blabla' })
        wrapper.setProps({ ui: { adding: [uuid] } })
        expect(wrapper.state().title).toEqual('')
      })
    })

    describe('submit', () => {

      it('input', () => {

        const clearUIEditingAdding = jest.fn()
        const create = jest.fn()
        const setUIExpanded = jest.fn()
        const wrapper = shallow(getComponent({ ui: { adding: [uuid] }, clearUIEditingAdding, create, setUIExpanded }))

        wrapper.setState({ title: 'user input' })
        const mockEvent = getMockEvent()
        wrapper.find('form').simulate('submit', mockEvent)
        expect(clearUIEditingAdding.mock.calls.length).toBe(1)
        expect(create.mock.calls.length).toBe(1)
        expect(create.mock.calls[0][1]).toEqual({ title: 'user input' })
        expect(setUIExpanded.mock.calls.length).toBe(1)
      })

      it('empty (whitespace) input', () => {

        const clearUIEditingAdding = jest.fn()
        const create = jest.fn()
        const setUIExpanded = jest.fn()
        const wrapper = shallow(getComponent({ ui: { adding: [uuid] }, clearUIEditingAdding, setUIExpanded, create }))

        wrapper.setState({ title: ' ' })
        const mockEvent = getMockEvent()
        wrapper.find('form').simulate('submit', mockEvent)
        expect(clearUIEditingAdding.mock.calls.length).toBe(1)
        expect(create.mock.calls.length).toBe(0)
        expect(setUIExpanded.mock.calls.length).toBe(0)
      })
    })
  })
})

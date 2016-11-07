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
    isEditing: false,
    setIsEditing: noop,
    unsetIsEditing: noop,
    expand: noop,
    postNode: noop
  }
  const getComponent = getComponentHOF(NodeAdd, defaultProps)

  describe('editing', () => {

    it('false', () => {
      const wrapper = shallow(getComponent())
      expect(wrapper.render().find('input').length).toBe(0)
    })

    it('true', () => {
      const wrapper = shallow(getComponent({ isEditing: true }))
      expect(wrapper.render().find('input').length).toBe(1)
    })
  })

  describe('state title', () => {

    it('clear on isEditing change', () => {

      const wrapper = shallow(getComponent())
      wrapper.setState({ title: 'user input' })
      expect(wrapper.state().title).toBe('user input')
      wrapper.setProps({ isEditing: true })
      expect(wrapper.state().title).toBe('')
    })
  })

  describe('input', () => {

    it('change', () => {
      const wrapper = shallow(getComponent({ isEditing: true }))
      const input = document.createElement('input')
      input.value = 'user input'
      const mockEvent = getMockEvent({ target: input })
      wrapper.find('input').simulate('change', mockEvent)
      expect(wrapper.state().title).toEqual('user input')
    })

    describe('componentWillReceiveProps', () => {

      it('true => false', () => {
        const wrapper = shallow(getComponent({ isEditing: true }))
        wrapper.setState({ title: 'blabla' })
        wrapper.setProps({ isEditing: false })
        expect(wrapper.state().title).toEqual('')
      })

      it('false => true', () => {
        const wrapper = shallow(getComponent({ isEditing: false }))
        wrapper.setState({ title: 'blabla' })
        wrapper.setProps({ isEditing: true })
        expect(wrapper.state().title).toEqual('')
      })
    })

    describe('sumbit', () => {

      it('input', () => {

        const unsetIsEditing = jest.fn()
        const postNode = jest.fn()
        const expand = jest.fn()
        const wrapper = shallow(getComponent({ isEditing: true, unsetIsEditing, postNode, expand }))

        wrapper.setState({ title: 'user input' })
        const mockEvent = getMockEvent()
        wrapper.find('form').simulate('submit', mockEvent)
        expect(unsetIsEditing.mock.calls.length).toBe(1)
        expect(postNode.mock.calls.length).toBe(1)
        expect(postNode.mock.calls[0][1]).toEqual({ title: 'user input' })
        expect(expand.mock.calls.length).toBe(1)
      })

      it('empty (whitespace) input', () => {

        const unsetIsEditing = jest.fn()
        const postNode = jest.fn()
        const expand = jest.fn()
        const wrapper = shallow(getComponent({ isEditing: true, unsetIsEditing, postNode }))

        wrapper.setState({ title: ' ' })
        const mockEvent = getMockEvent()
        wrapper.find('form').simulate('submit', mockEvent)
        expect(unsetIsEditing.mock.calls.length).toBe(1)
        expect(postNode.mock.calls.length).toBe(0)
        expect(expand.mock.calls.length).toBe(0)
      })
    })
  })
})

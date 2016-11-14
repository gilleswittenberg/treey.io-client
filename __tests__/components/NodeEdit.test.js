import NodeEdit from '../../app/components/NodeEdit'
import { shallow } from 'enzyme'
import getComponentHOF from '../getComponent'
import noop from '../noop'
import getMockEvent from '../getMockEvent'

describe('NodeEdit', () => {

  const lang = 'en'
  const parent = '57bedc40e81b0620300d769a'
  const uid = '57bedc40e81b0620300d769b'
  const defaultProps = {
    lang,
    parent,
    uid,
    title: '',
    clearNodeUI: noop,
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
      const clearNodeUI = jest.fn()
      const deleteNode = jest.fn()
      const wrapper = shallow(getComponent({ clearNodeUI, deleteNode }))
      const mockEvent = getMockEvent()
      wrapper.find('form').simulate('submit', mockEvent)
      // @TODO: test arguments
      expect(clearNodeUI.mock.calls.length).toBe(2)
      expect(deleteNode.mock.calls.length).toBe(1)
    })

    it('putNode', () => {
      const clearNodeUI = jest.fn()
      const putNode = jest.fn()
      const wrapper = shallow(getComponent({ clearNodeUI, putNode }))
      wrapper.setState({ title: 'user input' })
      const mockEvent = getMockEvent()
      wrapper.find('form').simulate('submit', mockEvent)
      // @TODO: test arguments
      expect(clearNodeUI.mock.calls.length).toBe(2)
      expect(putNode.mock.calls.length).toBe(1)
      expect(putNode.mock.calls[0][2]).toEqual({ title: 'user input' })
    })
  })
})

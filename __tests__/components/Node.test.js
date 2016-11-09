import Node from '../../app/components/Node'
import { mount } from 'enzyme'
import getComponentHOF from '../getComponent'
import noop from '../noop'
import getMockEvent from '../getMockEvent'

describe('Node', () => {

  const ui = { enableDnD: false }
  const lang = 'en'
  const parent = '57bedc40e81b0620300d769a'
  const uid = '57bedc40e81b0620300d769b'

  const defaultProps = {
    ui,
    lang,
    parent,
    isRoot: false,
    uid,
    data: {
      title: ''
    },
    hasNodes: false,
    siblings: [{ uid }],
    index: 0,
    unsetIsEditing: noop,
    setIsEditing: noop,
    toggleExpanded: noop,
    deleteNode: noop,
    setShowButtons: noop,
    setIsDragging: noop,
    unsetIsDragging: noop
  }
  const getComponent = getComponentHOF(Node, defaultProps)

  describe('handleClick', () => {

    it('altKey', () => {
      const setIsEditing = jest.fn()
      const node = new Node({ setIsEditing })
      const mockEvent = getMockEvent({ altKey: true })
      node.handleClick(mockEvent)
      expect(setIsEditing.mock.calls.length).toBe(1)
    })

    it('canExpand', () => {
      const toggleExpanded = jest.fn()
      const unsetIsEditing = noop
      const node = new Node({ unsetIsEditing, toggleExpanded })
      const mockEvent = getMockEvent()
      node.handleClick(mockEvent)
      expect(toggleExpanded.mock.calls.length).toBe(0)
    })

    it('toggleExpanded', () => {
      const toggleExpanded = jest.fn()
      const unsetIsEditing = noop
      const node = new Node({ hasNodes: true, unsetIsEditing, toggleExpanded })
      const mockEvent = getMockEvent()
      node.handleClick(mockEvent)
      expect(toggleExpanded.mock.calls.length).toBe(1)
    })
  })

  describe('startIsEditing', () => {

    it('handleClickEdit', () => {
      const setIsEditing = jest.fn()
      const wrapper = mount(getComponent({ setIsEditing }))
      wrapper.find('.button-icon-edit').simulate('click')
      expect(setIsEditing.mock.calls.length).toBe(1)
    })

    it('handleClickAdd', () => {
      const setIsEditing = jest.fn()
      const wrapper = mount(getComponent({ setIsEditing, showAddButton: true }))
      wrapper.find('.button-icon-add').simulate('click')
      expect(setIsEditing.mock.calls.length).toBe(1)
      expect(setIsEditing.mock.calls[0][1]).toEqual('add')
    })
  })

  describe('handleClickDelete', () => {

    it('non root', () => {
      const deleteNode = jest.fn()
      const wrapper = mount(getComponent({
        deleteNode
      }))
      wrapper.find('.button-icon-delete').simulate('click')
      expect(deleteNode.mock.calls.length).toBe(1)
    })

    it('root', () => {
      const wrapper = mount(getComponent({ isRoot: true }))
      expect(wrapper.find('.button-icon-delete').length).toBe(0)
    })
  })

  describe('handleClickShowButtons', () => {

    it('click', () => {
      const setShowButtons = jest.fn()
      const wrapper = mount(getComponent({ setShowButtons }))
      const mockEvent =  getMockEvent()
      wrapper.find('.button-icon-more').simulate('click', mockEvent)
      expect(setShowButtons.mock.calls.length).toBe(1)
    })
  })
})

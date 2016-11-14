import Node from '../../app/components/Node'
import { mount } from 'enzyme'
import getComponentHOF from '../getComponent'
import noop from '../noop'
import getMockEvent from '../getMockEvent'
import defaultUI from '../../app/lib/defaultUI'

describe('Node', () => {

  const app = { enableDnD: false }
  const lang = 'en'
  const ui = defaultUI
  const parent = '57bedc40e81b0620300d769a'
  const uid = '57bedc40e81b0620300d769b'

  const defaultProps = {
    app,
    lang,
    parent,
    isRoot: false,
    uid,
    path: [],
    data: {
      title: ''
    },
    ui,
    hasNodes: false,
    siblings: [{ uid, ui }],
    index: 0,
    clearNodeUI: noop,
    updateNodeUI: noop,
    deleteNode: noop
  }
  const getComponent = getComponentHOF(Node, defaultProps)

  describe('handleClick', () => {

    it('altKey', () => {
      const updateNodeUI = jest.fn()
      // @TODO: use mount / shallow
      const node = new Node({ updateNodeUI, ui })
      const mockEvent = getMockEvent({ altKey: true })
      node.handleClick(mockEvent)
      expect(updateNodeUI.mock.calls.length).toBe(1)
    })

    it('canExpand', () => {
      const updateNodeUI = jest.fn()
      const clearNodeUI = noop
      // @TODO: use mount / shallow
      const node = new Node({ clearNodeUI, updateNodeUI, ui })
      const mockEvent = getMockEvent()
      node.handleClick(mockEvent)
      expect(updateNodeUI.mock.calls.length).toBe(0)
    })

    it('updateNodeUI', () => {
      const updateNodeUI = jest.fn()
      const clearNodeUI = noop
      // @TODO: use mount / shallow
      const node = new Node({ hasNodes: true, clearNodeUI, updateNodeUI, ui })
      const mockEvent = getMockEvent()
      node.handleClick(mockEvent)
      expect(updateNodeUI.mock.calls.length).toBe(1)
    })
  })

  describe('startIsEditing', () => {

    it('handleClickEdit', () => {
      const updateNodeUI = jest.fn()
      const wrapper = mount(getComponent({ updateNodeUI }))
      wrapper.find('.button-icon-edit').simulate('click')
      expect(updateNodeUI.mock.calls.length).toBe(1)
    })

    it('handleClickAdd', () => {
      const updateNodeUI = jest.fn()
      const wrapper = mount(getComponent({ updateNodeUI, showAddButton: true }))
      wrapper.find('.button-icon-add').simulate('click')
      expect(updateNodeUI.mock.calls.length).toBe(1)
      expect(updateNodeUI.mock.calls[0][1]).toEqual('adding')
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
      const updateNodeUI = jest.fn()
      const wrapper = mount(getComponent({ updateNodeUI }))
      const mockEvent =  getMockEvent()
      wrapper.find('.button-icon-more').simulate('click', mockEvent)
      expect(updateNodeUI.mock.calls.length).toBe(1)
    })
  })
})

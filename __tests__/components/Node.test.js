/* @flow */

// @TODO: clean up
declare var describe: any
declare var it: any
declare var expect: any
declare var jest: any

import Node from '../../app/components/Node'
import { mount } from 'enzyme'
import getComponentHOF from '../getComponent'
import noop from '../noop'
import getMockEvent from '../getMockEvent'
import defaultUI from '../../app/lib/ui/defaultUI'
import { uid, uid1 } from '../uid'

describe('Node', () => {

  const app = { enableDnD: false }
  const lang = 'en'
  const ui = defaultUI
  const parent = uid1

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
    clearUIEditing: noop,
    setUIEditing: noop,
    setUIAdding: noop,
    setUIExpanded: noop,
    clearNodeUI: noop,
    updateNodeUI: noop,
    deleteNode: noop
  }
  const getComponent = getComponentHOF(Node, defaultProps)

  describe('handleClick', () => {

    it('altKey', () => {
      const setUIEditing = jest.fn()
      // @TODO: use mount / shallow
      const node = new Node({ setUIEditing, ui })
      const mockEvent = getMockEvent({ altKey: true })
      node.handleClick(mockEvent)
      expect(setUIEditing.mock.calls.length).toBe(1)
    })

    it('canExpand', () => {
      const updateNodeUI = jest.fn()
      const clearUIEditing = noop
      // @TODO: use mount / shallow
      const node = new Node({ clearUIEditing, updateNodeUI, ui })
      const mockEvent = getMockEvent()
      node.handleClick(mockEvent)
      expect(updateNodeUI.mock.calls.length).toBe(0)
    })

    it('updateNodeUI', () => {
      const setUIExpanded = jest.fn()
      const clearUIEditing = noop
      // @TODO: use mount / shallow
      const node = new Node({ hasNodes: true, clearUIEditing, setUIExpanded, ui })
      const mockEvent = getMockEvent()
      node.handleClick(mockEvent)
      expect(setUIExpanded.mock.calls.length).toBe(1)
      expect(setUIExpanded.mock.calls[0][1]).toBe(true)
    })
  })

  describe('startIsEditing', () => {

    it('handleClickEdit', () => {
      const setUIEditing = jest.fn()
      const wrapper = mount(getComponent({ setUIEditing }))
      wrapper.find('.button-icon-edit').simulate('click')
      expect(setUIEditing.mock.calls.length).toBe(1)
    })

    it('handleClickAdd', () => {
      const setUIAdding = jest.fn()
      const wrapper = mount(getComponent({ setUIAdding, showAddButton: true }))
      wrapper.find('.button-icon-add').simulate('click')
      expect(setUIAdding.mock.calls.length).toBe(1)
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

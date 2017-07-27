/* @flow */

// Required for Flow type
declare var describe: any
declare var it: any
declare var expect: any
declare var jest: any

import Node from '../../app/components/Node'
import { mount, shallow } from 'enzyme'
import getComponentHOF from '../getComponent'
import noop from '../noop'
import getMockEvent from '../getMockEvent'
import defaultUI from '../../app/lib/ui/defaultUI'
import { uuid, uuid1 } from '../uuid'

describe('Node', () => {

  const app = { enableDnD: false }
  const lang = 'en'
  const ui = defaultUI
  const parent = uuid1

  // @TODO: Extract defaultProps for all Node tests
  const defaultProps = {
    app,
    lang,
    parent,
    isRoot: false,
    uuid,
    treePath: [],
    data: {
      title: ''
    },
    ui,
    hasNodes: false,
    siblings: [{ uuid, ui }],
    index: 0,
    nodesArray: [],

    clearUIEditingAdding: noop,
    setUIEditing: noop,
    setUIAdding: noop,
    setUIActive: noop,
    setUIExpanded: noop,
    unsetUIExpanded: noop,
    setUIMovingChild: noop,
    clearUIMovingChild: noop,
    clearUIButtonsShown: noop,
    setUIDragging: noop,
    clearUIDragging: noop,
    setUIButtonsShown: noop,

    create: noop,
    update: noop,
    remove: noop,
    move: noop
  }
  const getComponent = getComponentHOF(Node, defaultProps)

  describe('handleClick', () => {

    it('altKey', () => {
      const setUIEditing = jest.fn()
      const mockEvent = getMockEvent({ altKey: true })
      const wrapper = mount(getComponent({ setUIEditing }))
      wrapper.find('.node-content').simulate('click', mockEvent)
      expect(setUIEditing.mock.calls.length).toBe(1)
    })

    it('canExpand', () => {
      const setUIExpanded = jest.fn()
      const wrapper = mount(getComponent({ setUIExpanded }))
      wrapper.find('.node-content').simulate('click')
      expect(setUIExpanded.mock.calls.length).toBe(0)
    })

    it('setUIExpanded', () => {
      const setUIExpanded = jest.fn()
      const wrapper = mount(getComponent({ setUIExpanded, hasNodes: true }))
      wrapper.find('.node-content').simulate('click')
      expect(setUIExpanded.mock.calls.length).toBe(1)
      expect(setUIExpanded.mock.calls[0][0]).toEqual([])
    })

    it('setUIActive', () => {
      const setUIActive = jest.fn()
      const wrapper = mount(getComponent({ setUIActive }))
      wrapper.find('.node-content').simulate('click')
      expect(setUIActive.mock.calls.length).toBe(1)
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
      const remove = jest.fn()
      const wrapper = mount(getComponent({ remove }))
      wrapper.find('.button-icon-delete').simulate('click')
      expect(remove.mock.calls.length).toBe(1)
    })

    it('root', () => {
      const wrapper = mount(getComponent({ isRoot: true }))
      expect(wrapper.find('.button-icon-delete').length).toBe(0)
    })
  })

  describe('handleClickShowButtons', () => {

    it('click', () => {
      const setUIButtonsShown = jest.fn()
      const wrapper = mount(getComponent({ setUIButtonsShown }))
      const mockEvent =  getMockEvent()
      wrapper.find('.button-icon-more').simulate('click', mockEvent)
      expect(setUIButtonsShown.mock.calls.length).toBe(1)
    })
  })

  describe('remove', () => {

    it('remove', () => {
      const remove = jest.fn()
      const setUIActive = jest.fn()
      const wrapper = shallow(getComponent({ remove, setUIActive }))
      wrapper.instance().remove([])
      expect(remove.mock.calls.length).toBe(1)
      expect(setUIActive.mock.calls.length).toBe(1)
    })
  })
})

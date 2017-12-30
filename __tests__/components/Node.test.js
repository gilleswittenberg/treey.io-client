/* @flow */

// Required for Flow type
declare var describe: any
declare var it: any
declare var expect: any
declare var jest: any

import React from 'React'
import { MemoryRouter } from 'react-router-dom'
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
    data: { title: '' },
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
      const wrapper = mount(<MemoryRouter>{ getComponent({ setUIEditing }) }</MemoryRouter>)
      wrapper.find('.node-content').simulate('click', mockEvent)
      expect(setUIEditing.mock.calls).toHaveLength(1)
    })

    it('canExpand', () => {
      const setUIExpanded = jest.fn()
      const wrapper = mount(<MemoryRouter>{ getComponent({ setUIExpanded }) }</MemoryRouter>)
      wrapper.find('.node-content').simulate('click')
      expect(setUIExpanded.mock.calls).toHaveLength(0)
    })

    it('setUIExpanded', () => {
      const setUIExpanded = jest.fn()
      const wrapper = mount(<MemoryRouter>{ getComponent({ setUIExpanded, hasNodes: true }) }</MemoryRouter>)
      wrapper.find('.node-content').simulate('click')
      expect(setUIExpanded.mock.calls).toHaveLength(1)
      expect(setUIExpanded.mock.calls[0][0]).toEqual([])
    })

    it('setUIActive', () => {
      const setUIActive = jest.fn()
      const wrapper = mount(<MemoryRouter>{ getComponent({ setUIActive }) }</MemoryRouter>)
      wrapper.find('.node-content').simulate('click')
      expect(setUIActive.mock.calls).toHaveLength(1)
    })

    it('root', () => {
      const setUIExpanded = jest.fn()
      const clearUIEditingAdding = jest.fn()
      const setUIActive = jest.fn()
      const wrapper = mount(<MemoryRouter>{ getComponent({
        treePath: [uuid],
        setUIExpanded,
        clearUIEditingAdding,
        setUIActive,
        hasNodes: true,
        isRoot: true,
        ui: { expanded: { '0': [uuid] } } // eslint-disable-line quote-props
      }) }</MemoryRouter>)
      wrapper.find('.node-content').simulate('click')
      expect(setUIExpanded.mock.calls).toHaveLength(0)
      expect(clearUIEditingAdding.mock.calls).toHaveLength(1)
      expect(setUIActive.mock.calls).toHaveLength(1)
    })

  })

  describe('startIsEditing', () => {

    it('handleClickEdit', () => {
      const setUIEditing = jest.fn()
      const wrapper = mount(<MemoryRouter>{ getComponent({ setUIEditing }) }</MemoryRouter>)
      wrapper.find('.button-icon-edit').simulate('click')
      expect(setUIEditing.mock.calls).toHaveLength(1)
    })

    it('handleClickAdd', () => {
      const setUIAdding = jest.fn()
      const wrapper = mount(<MemoryRouter>{ getComponent({ setUIAdding, showAddButton: true }) }</MemoryRouter>)
      wrapper.find('.button-icon-add').simulate('click')
      expect(setUIAdding.mock.calls).toHaveLength(1)
    })
  })


  describe('handleClickShowButtons', () => {

    it('click', () => {
      const setUIButtonsShown = jest.fn()
      const wrapper = mount(<MemoryRouter>{ getComponent({ setUIButtonsShown }) }</MemoryRouter>)
      const mockEvent = getMockEvent()
      wrapper.find('.button-icon-more').simulate('click', mockEvent)
      expect(setUIButtonsShown.mock.calls).toHaveLength(1)
    })
  })

  describe('delete', () => {

    describe('handleClickDelete', () => {

      it('non root', () => {
        const remove = jest.fn()
        const wrapper = mount(<MemoryRouter>{ getComponent({ remove }) }</MemoryRouter>)
        wrapper.find('.button-icon-delete').simulate('click')
        expect(remove.mock.calls).toHaveLength(1)
      })

      it('root', () => {
        const wrapper = mount(<MemoryRouter>{ getComponent({ isRoot: true }) }</MemoryRouter>)
        expect(wrapper.find('.button-icon-delete')).toHaveLength(0)
      })
    })

    describe('remove', () => {

      it('remove', () => {
        const remove = jest.fn()
        const setUIActive = jest.fn()
        const uiActive = Object.assign({}, defaultUI, { active: uuid })
        const wrapper = shallow(getComponent({ remove, setUIActive, ui: uiActive }))
        wrapper.instance().remove([])
        expect(remove.mock.calls).toHaveLength(1)
        expect(setUIActive.mock.calls).toHaveLength(1)
      })

      it('root', () => {
        const remove = jest.fn()
        const setUIActive = jest.fn()
        const wrapper = shallow(getComponent({ remove, setUIActive, isRoot: true }))
        wrapper.instance().remove([])
        expect(remove.mock.calls).toHaveLength(0)
        expect(setUIActive.mock.calls).toHaveLength(0)
      })
    })
  })

  describe('canExpand', () => {

    it('default', () => {
      const wrapper = shallow(getComponent())
      expect(wrapper.instance().canExpand()).toBe(false)
    })

    it('hasNodes', () => {
      const wrapper = shallow(getComponent({ hasNodes: true }))
      expect(wrapper.instance().canExpand()).toBe(true)
    })
  })

  describe('isExpanded', () => {

    it('default', () => {
      const wrapper = shallow(getComponent())
      expect(wrapper.instance().isExpanded()).toBe(false)
    })

    it('isExpanded', () => {
      const wrapper = shallow(getComponent({ treePath: [uuid], ui: { expanded: { '0': [uuid] } } })) // eslint-disable-line quote-props
      expect(wrapper.instance().isExpanded()).toBe(true)
    })
  })

  describe('isUI', () => {

    it('default', () => {
      const wrapper = shallow(getComponent())
      expect(wrapper.instance().isUI('active')).toBe(false)
    })

    it('isUI', () => {
      const wrapper = shallow(getComponent({ treePath: [uuid], ui: { active: [uuid] } }))
      expect(wrapper.instance().isUI('active')).toBe(true)
    })
  })

  describe('userIsDragging', () => {

    it('default', () => {
      const wrapper = shallow(getComponent())
      expect(wrapper.instance().userIsDragging()).toBe(false)
    })

    it('dragging', () => {
      const wrapper = shallow(getComponent({ ui: { dragging: [uuid] } }))
      expect(wrapper.instance().userIsDragging()).toBe(true)
    })
  })
})

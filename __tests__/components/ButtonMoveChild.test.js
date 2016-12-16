/* @flow */

// @TODO: clean up
declare var describe: any
declare var it: any
declare var expect: any
declare var jest: any

import React, { Component } from 'react'
import ButtonMoveChild from '../../app/components/ButtonMoveChild'
import NodeDraggable from '../../app/components/NodeDraggable'
import TestBackend from 'react-dnd-test-backend'
import { DragDropContext } from 'react-dnd'
import { mount } from 'enzyme'
import noop from '../noop'
import { uid, uid1 } from '../uid'

// Wraps a component into a DragDropContext that uses the TestBackend.
function wrapInTestContext (DecoratedDraggableComponent, DecoratedButtonMoveChildComponent, propsDraggable, propsButtonMoveChild) {
  @DragDropContext(TestBackend)
  class TestContextContainer extends Component {
    render () {
      return (
        <div>
          <DecoratedDraggableComponent { ...propsDraggable } />
          <DecoratedButtonMoveChildComponent { ...propsButtonMoveChild } />
        </div>
      )
    }
  }
  return TestContextContainer
}

describe('ButtonMoveChild', () => {

  const defaultPropsDraggable = {
    parent: null,
    isRoot: false,
    uid,
    data: {
      title: 'node draggable'
    },
    ui: {},
    siblings: [{ uid }],
    index: 0,
    clearUIEditing: noop,
    setUIDragging: noop,
    clearUIDragging: noop,
    handleClick: noop,
    handleClickMore: noop
  }
  const defaultPropsButtonMoveChild = {
    lang: 'en',
    parent: null,
    isRoot: false,
    uid: uid1,
    app: {},
    data: {
      title: 'node droppable'
    },
    ui: {},
    hasNodes: false,
    deleteNode: noop,
    putMoveNode: noop,
    setUIExpanded: noop,
    setUIMovingChild: noop,
    clearUIMovingChild: noop,
    setUIDragging: noop,
    clearUIDragging: noop
  }

  describe('hover', () => {

    it('setUIMovingChild', () => {

      const setUIMovingChild = jest.fn()
      const propsDraggable = { ...defaultPropsDraggable }
      const propsButtonMoveChild = { ...defaultPropsButtonMoveChild, setUIMovingChild }
      const Context = wrapInTestContext(NodeDraggable, ButtonMoveChild, propsDraggable, propsButtonMoveChild)
      const wrapper = mount(<Context />)
      const manager = wrapper.get(0).getManager()
      const backend = manager.getBackend()
      const nodeDraggable = wrapper.find(NodeDraggable).get(0)
      const sourceIdNodeDraggable = nodeDraggable.getHandlerId()
      const buttonMoveChild = wrapper.find(ButtonMoveChild).get(0)
      const sourceIdButtonMoveChild = buttonMoveChild.getHandlerId()
      backend.simulateBeginDrag([sourceIdNodeDraggable])
      backend.simulateHover([sourceIdButtonMoveChild])
      expect(setUIMovingChild.mock.calls.length).toBe(1)
    })

    it('clearUIMovingChild', () => {
      const clearUIMovingChild = jest.fn()
      const propsDraggable = { ...defaultPropsDraggable }
      const propsButtonMoveChild = { ...defaultPropsButtonMoveChild, clearUIMovingChild }
      const Context = wrapInTestContext(NodeDraggable, ButtonMoveChild, propsDraggable, propsButtonMoveChild)
      const wrapper = mount(<Context />)
      const manager = wrapper.get(0).getManager()
      const backend = manager.getBackend()
      const nodeDraggable = wrapper.find(NodeDraggable).get(0)
      const sourceIdNodeDraggable = nodeDraggable.getHandlerId()
      const buttonMoveChild = wrapper.find(ButtonMoveChild).get(0)
      const sourceIdButtonMoveChild = buttonMoveChild.getHandlerId()
      backend.simulateBeginDrag([sourceIdNodeDraggable])
      backend.simulateHover([sourceIdButtonMoveChild])
      backend.simulateEndDrag()
      expect(clearUIMovingChild.mock.calls.length).toBe(1)
    })
  })

  describe('drop', () => {

    it('putMoveNode, setUIExpanded', () => {

      const putMoveNode = jest.fn()
      const setUIExpanded = jest.fn()
      const propsDraggable = { ...defaultPropsDraggable }
      const propsButtonMoveChild = { ...defaultPropsButtonMoveChild, putMoveNode, setUIExpanded }
      const Context = wrapInTestContext(NodeDraggable, ButtonMoveChild, propsDraggable, propsButtonMoveChild)
      const wrapper = mount(<Context />)
      const manager = wrapper.get(0).getManager()
      const backend = manager.getBackend()
      const nodeDraggable = wrapper.find(NodeDraggable).get(0)
      const sourceIdNodeDraggable = nodeDraggable.getHandlerId()
      const buttonMoveChild = wrapper.find(ButtonMoveChild).get(0)
      const sourceIdButtonMoveChild = buttonMoveChild.getHandlerId()
      backend.simulateBeginDrag([sourceIdNodeDraggable])
      backend.simulateHover([sourceIdButtonMoveChild])
      backend.simulateDrop()
      backend.simulateEndDrag()
      expect(putMoveNode.mock.calls.length).toBe(1)
      expect(setUIExpanded.mock.calls.length).toBe(1)
    })
  })
})

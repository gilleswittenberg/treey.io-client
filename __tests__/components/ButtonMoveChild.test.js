import React, { Component } from 'react'
import ButtonMoveChild from '../../app/components/ButtonMoveChild'
import NodeDraggable from '../../app/components/NodeDraggable'
import TestBackend from 'react-dnd-test-backend'
import { DragDropContext } from 'react-dnd'
import { mount } from 'enzyme'
import noop from '../noop'

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

  const uid1 = '57bedc40e81b0620300d7691'
  const uid2 = '57bedc40e81b0620300d7692'
  const defaultPropsDraggable = {
    parent: null,
    isRoot: false,
    uid: uid1,
    title: 'node draggable',
    siblings: [{ uid: uid1 }],
    index: 0,
    unsetIsEditing: noop,
    setIsDragging: noop,
    unsetIsDragging: noop,
    handleClick: noop,
    handleClickMore: noop
  }
  const defaultPropsButtonMoveChild = {
    lang: 'en',
    parent: null,
    isRoot: false,
    uid: uid2,
    ui: {},
    title: 'node droppable',
    hasNodes: false,
    deleteNode: noop,
    putMoveNode: noop,
    setIsEditing: noop,
    unsetIsEditing: noop,
    setIsMovingChild: noop,
    unsetIsMovingChild: noop,
    setIsDragging: noop,
    unsetIsDragging: noop,
    setShowButtons: noop,
    toggleExpanded: noop
  }

  describe('hover', () => {

    it('setIsMovingChild', () => {

      const setIsMovingChild = jest.fn()
      const propsDraggable = { ...defaultPropsDraggable }
      const propsButtonMoveChild = { ...defaultPropsButtonMoveChild, setIsMovingChild }
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
      expect(setIsMovingChild.mock.calls.length).toBe(1)
    })

    it('unsetIsMovingChild', () => {
      const unsetIsMovingChild = jest.fn()
      const propsDraggable = { ...defaultPropsDraggable }
      const propsButtonMoveChild = { ...defaultPropsButtonMoveChild, unsetIsMovingChild }
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
      expect(unsetIsMovingChild.mock.calls.length).toBe(1)
    })
  })

  describe('drop', () => {

    it('putMoveNode', () => {

      const putMoveNode = jest.fn()
      const propsDraggable = { ...defaultPropsDraggable }
      const propsButtonMoveChild = { ...defaultPropsButtonMoveChild, putMoveNode }
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
    })
  })
})

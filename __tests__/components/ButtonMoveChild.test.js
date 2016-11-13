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
    data: {
      title: 'node draggable'
    },
    ui: {},
    siblings: [{ uid: uid1 }],
    index: 0,
    clearNodeUI: noop,
    updateNodeUI: noop,
    handleClick: noop,
    handleClickMore: noop
  }
  const defaultPropsButtonMoveChild = {
    lang: 'en',
    parent: null,
    isRoot: false,
    uid: uid2,
    app: {},
    data: {
      title: 'node droppable'
    },
    ui: {},
    hasNodes: false,
    deleteNode: noop,
    putMoveNode: noop,
    clearNodeUI: noop,
    updateNodeUI: noop
  }

  describe('hover', () => {

    it('updateNodeUI', () => {

      const updateNodeUI = jest.fn()
      const propsDraggable = { ...defaultPropsDraggable }
      const propsButtonMoveChild = { ...defaultPropsButtonMoveChild, updateNodeUI }
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
      expect(updateNodeUI.mock.calls.length).toBe(1)
    })

    it('clearNodeUI', () => {
      const clearNodeUI = jest.fn()
      const propsDraggable = { ...defaultPropsDraggable }
      const propsButtonMoveChild = { ...defaultPropsButtonMoveChild, clearNodeUI }
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
      expect(clearNodeUI.mock.calls.length).toBe(1)
    })
  })

  describe('drop', () => {

    it('putMoveNode, updateNodeUI', () => {

      const putMoveNode = jest.fn()
      const updateNodeUI = jest.fn()
      const propsDraggable = { ...defaultPropsDraggable }
      const propsButtonMoveChild = { ...defaultPropsButtonMoveChild, putMoveNode, updateNodeUI }
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
      // @TODO: test argument
      expect(updateNodeUI.mock.calls.length).toBe(2)
    })
  })
})

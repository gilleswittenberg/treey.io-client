/* @flow */

// Required for Flow type
declare var describe: any
declare var it: any
declare var expect: any
declare var jest: any

import React, { Component } from 'react'
import { MemoryRouter } from 'react-router-dom'
import ButtonMoveChild from '../../app/components/ButtonMoveChild'
import NodeDraggable from '../../app/components/NodeDraggable'
import TestBackend from 'react-dnd-test-backend'
import { DragDropContext } from 'react-dnd'
import { mount } from 'enzyme'
import noop from '../noop'
import { uuid } from '../uuid'

// Wraps a component into a DragDropContext that uses the TestBackend.
function wrapInTestContext (DecoratedDraggableComponent, DecoratedButtonMoveChildComponent, propsDraggable, propsButtonMoveChild) {
  @DragDropContext(TestBackend) // eslint-disable-line new-cap
  class TestContextContainer extends Component<{}> {
    render () {
      return (
        <MemoryRouter>
          <div>
            <DecoratedDraggableComponent { ...propsDraggable } />
            <DecoratedButtonMoveChildComponent { ...propsButtonMoveChild } />
          </div>
        </MemoryRouter>
      )
    }
  }
  return TestContextContainer
}

describe('ButtonMoveChild', () => {

  const defaultPropsDraggable = {
    isRoot: false,
    uuid,
    treePath: [uuid],
    data: { title: 'NodeDraggable' },
    clearUIEditingAdding: noop,
    setUIDragging: noop,
    clearUIDragging: noop,
    setUIActive: noop,
    setUIEditing: noop,
    handleClick: noop,
    handleClickMore: noop
  }
  const defaultPropsButtonMoveChild = {
    lang: 'en',
    setUIExpanded: noop,
    setUIMovingChild: noop,
    clearUIMovingChild: noop
  }

  describe('hover', () => {

    it('setUIMovingChild', () => {

      const setUIMovingChild = jest.fn()
      const propsDraggable = { ...defaultPropsDraggable }
      const propsButtonMoveChild = { ...defaultPropsButtonMoveChild, setUIMovingChild }
      const Context = wrapInTestContext(NodeDraggable, ButtonMoveChild, propsDraggable, propsButtonMoveChild)
      const wrapper = mount(<Context />)
      const manager = wrapper.instance().getManager()
      const backend = manager.getBackend()
      const nodeDraggable = wrapper.find(NodeDraggable).instance()
      const sourceIdNodeDraggable = nodeDraggable.getHandlerId()
      const buttonMoveChild = wrapper.find(ButtonMoveChild).instance()
      const sourceIdButtonMoveChild = buttonMoveChild.getHandlerId()
      backend.simulateBeginDrag([sourceIdNodeDraggable])
      backend.simulateHover([sourceIdButtonMoveChild])
      expect(setUIMovingChild.mock.calls).toHaveLength(1)
    })

    it('clearUIMovingChild', () => {
      const clearUIMovingChild = jest.fn()
      const propsDraggable = { ...defaultPropsDraggable }
      const propsButtonMoveChild = { ...defaultPropsButtonMoveChild, clearUIMovingChild }
      const Context = wrapInTestContext(NodeDraggable, ButtonMoveChild, propsDraggable, propsButtonMoveChild)
      const wrapper = mount(<Context />)
      const manager = wrapper.instance().getManager()
      const backend = manager.getBackend()
      const nodeDraggable = wrapper.find(NodeDraggable).instance()
      const sourceIdNodeDraggable = nodeDraggable.getHandlerId()
      const buttonMoveChild = wrapper.find(ButtonMoveChild).instance()
      const sourceIdButtonMoveChild = buttonMoveChild.getHandlerId()
      backend.simulateBeginDrag([sourceIdNodeDraggable])
      backend.simulateHover([sourceIdButtonMoveChild])
      backend.simulateEndDrag()
      expect(clearUIMovingChild.mock.calls).toHaveLength(1)
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
      const manager = wrapper.instance().getManager()
      const backend = manager.getBackend()
      const nodeDraggable = wrapper.find(NodeDraggable).instance()
      const sourceIdNodeDraggable = nodeDraggable.getHandlerId()
      const buttonMoveChild = wrapper.find(ButtonMoveChild).instance()
      const sourceIdButtonMoveChild = buttonMoveChild.getHandlerId()
      backend.simulateBeginDrag([sourceIdNodeDraggable])
      backend.simulateHover([sourceIdButtonMoveChild])
      backend.simulateDrop()
      backend.simulateEndDrag()
      expect(putMoveNode.mock.calls).toHaveLength(1)
      expect(setUIExpanded.mock.calls).toHaveLength(1)
    })
  })
})

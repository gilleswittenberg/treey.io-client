/* @flow */

// Required for Flow type
declare var describe: any
declare var it: any
declare var expect: any
declare var jest: any

import React, { Component } from 'react'
import NodeDroppable from '../../app/components/NodeDroppable'
import NodeDraggable from '../../app/components/NodeDraggable'
import TestBackend from 'react-dnd-test-backend'
import { DragDropContext } from 'react-dnd'
import { mount } from 'enzyme'
import defaultUI from '../../app/lib/ui/defaultUI'
import noop from '../noop'
import { uuid, uuid1, uuid2 } from '../uuid'

// Wraps a component into a DragDropContext that uses the TestBackend.
function wrapInTestContext (DecoratedDraggableComponent, DecoratedDroppableComponent, propsDraggable, propsDroppable) {
  @DragDropContext(TestBackend)
  class TestContextContainer extends Component {
    render () {
      return (
        <div>
          <DecoratedDraggableComponent { ...propsDraggable } />
          <DecoratedDroppableComponent { ...propsDroppable } />
        </div>
      )
    }
  }
  return TestContextContainer
}

describe('NodeDroppable', () => {

  const ui = defaultUI

  const defaultPropsDraggable = {
    isRoot: false,
    uuid,
    treePath: [uuid],
    data: { title: 'node draggable' },
    index: 0,
    siblings: [{ uuid }],
    setUIEditing: noop,
    clearUIEditingAdding: noop,
    setUIExpanded: noop,
    setUIMovingChild: noop,
    clearUIMovingChild: noop,
    setUIDragging: noop,
    clearUIDragging: noop,
    setUIActive: noop,
    handleClick: noop,
    handleClickMore: noop
  }
  const defaultPropsDroppable = {
    parent: null,
    isRoot: false,
    uuid: uuid1,
    treePath: [uuid1],
    app: {},
    data: {
      title: 'node droppable'
    },
    ui,
    hasNodes: false,
    siblings: [{ uuid: uuid1 }],
    index: 0,
    removeChild: noop,
    move: noop,
    setUIEditing: noop,
    setUIAdding: noop,
    setUIExpanded: noop,
    unsetUIExpanded: noop,
    setUIActive: noop,
    setUIMovingChild: noop,
    clearUIMovingChild: noop,
    clearUIButtonsShown: noop,
    setUIDragging: noop,
    clearUIDragging: noop,
    setUIButtonsShown: noop,
    clearUIEditingAdding: noop,
    handleClick: noop,
    handleClickMore: noop
  }

  describe('canDrop', () => {

    it('guard against root', () => {

      const move = jest.fn()
      const propsDraggable = { ...defaultPropsDraggable, move }
      const propsDroppable = { ...defaultPropsDroppable, isRoot: true }
      const Context = wrapInTestContext(NodeDraggable, NodeDroppable, propsDraggable, propsDroppable)
      const wrapper = mount(<Context />)
      const manager = wrapper.get(0).getManager()
      const backend = manager.getBackend()
      const nodeDraggable = wrapper.find(NodeDraggable).get(0)
      const sourceIdNodeDraggable = nodeDraggable.getHandlerId()
      const nodeDroppable = wrapper.find(NodeDroppable).get(0)
      const sourceIdNodeDroppable = nodeDroppable.getHandlerId()
      backend.simulateBeginDrag([sourceIdNodeDraggable])
      backend.simulateHover([sourceIdNodeDroppable])
      backend.simulateDrop()
      backend.simulateEndDrag()
      expect(move.mock.calls.length).toBe(0)
    })
  })

  describe('hover', () => {

    it('state isOverPosition', () => {

      const propsDraggable = { ...defaultPropsDraggable }
      const propsDroppable = { ...defaultPropsDroppable, isRoot: false }
      const Context = wrapInTestContext(NodeDraggable, NodeDroppable, propsDraggable, propsDroppable)
      const wrapper = mount(<Context />)
      const manager = wrapper.get(0).getManager()
      const backend = manager.getBackend()
      const nodeDraggable = wrapper.find(NodeDraggable).get(0)
      const sourceIdNodeDraggable = nodeDraggable.getHandlerId()
      const nodeDroppable = wrapper.find(NodeDroppable).get(0)
      const setState = jest.fn()
      nodeDroppable.decoratedComponentInstance.setState = setState
      const sourceIdNodeDroppable = nodeDroppable.getHandlerId()
      backend.simulateBeginDrag([sourceIdNodeDraggable])
      backend.simulateHover([sourceIdNodeDroppable])
      expect(setState.mock.calls.length).toBe(1)
    })

    it('guard against isRoot', () => {

      const propsDraggable = { ...defaultPropsDraggable }
      const propsDroppable = { ...defaultPropsDroppable, uuid }
      const Context = wrapInTestContext(NodeDraggable, NodeDroppable, propsDraggable, propsDroppable)
      const wrapper = mount(<Context />)
      const manager = wrapper.get(0).getManager()
      const backend = manager.getBackend()
      const nodeDraggable = wrapper.find(NodeDraggable).get(0)
      const sourceIdNodeDraggable = nodeDraggable.getHandlerId()
      const nodeDroppable = wrapper.find(NodeDroppable).get(0)
      const setState = jest.fn()
      nodeDroppable.decoratedComponentInstance.setState = setState
      const sourceIdNodeDroppable = nodeDroppable.getHandlerId()
      backend.simulateBeginDrag([sourceIdNodeDraggable])
      backend.simulateHover([sourceIdNodeDroppable])
      expect(setState.mock.calls.length).toBe(0)
    })
  })


  describe('drop', () => {

    describe('same position', () => {

      it('last child', () => {

        const move = jest.fn()
        const siblings = [{ uuid: uuid1 }, { uuid }]
        const propsDraggable = { ...defaultPropsDraggable, siblings, index: 1 }
        const propsDroppable = { ...defaultPropsDroppable, siblings, index: 0, hoverRegion: 'bottom', move }
        const Context = wrapInTestContext(NodeDraggable, NodeDroppable, propsDraggable, propsDroppable)
        const wrapper = mount(<Context />)
        const manager = wrapper.get(0).getManager()
        const backend = manager.getBackend()
        const nodeDraggable = wrapper.find(NodeDraggable).get(0)
        const sourceIdNodeDraggable = nodeDraggable.getHandlerId()
        const nodeDroppable = wrapper.find(NodeDroppable).get(0)
        const sourceIdNodeDroppable = nodeDroppable.getHandlerId()
        const setState = jest.fn()
        nodeDroppable.setState = setState
        backend.simulateBeginDrag([sourceIdNodeDraggable])
        backend.simulateHover([sourceIdNodeDroppable])
        backend.simulateDrop()
        backend.simulateEndDrag()
        expect(move.mock.calls.length).toBe(0)
      })

      it('before', () => {

        const move = jest.fn()
        const siblings = [{ uuid }, { uuid: uuid1 }]
        const propsDraggable = { ...defaultPropsDraggable, siblings, index: 0 }
        const propsDroppable = { ...defaultPropsDroppable, siblings, index: 1, move }
        const Context = wrapInTestContext(NodeDraggable, NodeDroppable, propsDraggable, propsDroppable)
        const wrapper = mount(<Context />)
        const manager = wrapper.get(0).getManager()
        const backend = manager.getBackend()
        const nodeDraggable = wrapper.find(NodeDraggable).get(0)
        const sourceIdNodeDraggable = nodeDraggable.getHandlerId()
        const nodeDroppable = wrapper.find(NodeDroppable).get(0)
        const sourceIdNodeDroppable = nodeDroppable.getHandlerId()
        const setState = jest.fn()
        nodeDroppable.setState = setState
        backend.simulateBeginDrag([sourceIdNodeDraggable])
        backend.simulateHover([sourceIdNodeDroppable])
        backend.simulateDrop()
        backend.simulateEndDrag()
        expect(move.mock.calls.length).toBe(0)
      })

      it('last child different parent', () => {

        const move = jest.fn()
        const siblingsDraggable = [{ uuid }]
        const siblingsDroppable = [{ uuid: uuid2 }, { uuid: uuid1 }]
        const propsDraggable = { ...defaultPropsDraggable, siblingsDraggable, index: 0 }
        const propsDroppable = { ...defaultPropsDroppable, siblingsDroppable, index: 1, overMousePosition: 'bottom', move }
        const Context = wrapInTestContext(NodeDraggable, NodeDroppable, propsDraggable, propsDroppable)
        const wrapper = mount(<Context />)
        const manager = wrapper.get(0).getManager()
        const backend = manager.getBackend()
        const nodeDraggable = wrapper.find(NodeDraggable).get(0)
        const sourceIdNodeDraggable = nodeDraggable.getHandlerId()
        const nodeDroppable = wrapper.find(NodeDroppable).get(0)
        const sourceIdNodeDroppable = nodeDroppable.getHandlerId()
        const setState = jest.fn()
        nodeDroppable.setState = setState
        backend.simulateBeginDrag([sourceIdNodeDraggable])
        backend.simulateHover([sourceIdNodeDroppable])
        backend.simulateDrop()
        backend.simulateEndDrag()
        expect(move.mock.calls.length).toBe(1)
      })
    })

    it('to call move', () => {

      const move = jest.fn()
      const propsDraggable = { ...defaultPropsDraggable }
      const propsDroppable = { ...defaultPropsDroppable, move }
      const Context = wrapInTestContext(NodeDraggable, NodeDroppable, propsDraggable, propsDroppable)
      const wrapper = mount(<Context />)
      const manager = wrapper.get(0).getManager()
      const backend = manager.getBackend()
      const nodeDraggable = wrapper.find(NodeDraggable).get(0)
      const sourceIdNodeDraggable = nodeDraggable.getHandlerId()
      const nodeDroppable = wrapper.find(NodeDroppable).get(0)
      const sourceIdNodeDroppable = nodeDroppable.getHandlerId()
      const setState = jest.fn()
      nodeDroppable.setState = setState
      backend.simulateBeginDrag([sourceIdNodeDraggable])
      backend.simulateHover([sourceIdNodeDroppable])
      backend.simulateDrop()
      backend.simulateEndDrag()
      expect(move.mock.calls.length).toBe(1)
    })
  })
})

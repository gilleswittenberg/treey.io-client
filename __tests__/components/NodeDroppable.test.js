/* @flow */

// @TODO: clean up
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
import { uid, uid1, uid2 } from '../uid'


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
    parent: null,
    isRoot: false,
    uid,
    path: [uid],
    data: {
      title: 'node draggable'
    },
    ui,
    siblings: [{ uid }],
    index: 0,
    setUIEditing: noop,
    clearUIEditing: noop,
    setUIExpanded: noop,
    setUIMovingChild: noop,
    setUIDragging: noop,
    clearNodeUI: noop,
    updateNodeUI: noop,
    handleClick: noop,
    handleClickMore: noop
  }
  const defaultPropsDroppable = {
    parent: null,
    isRoot: false,
    uid: uid1,
    path: [uid1],
    app: {},
    data: {
      title: 'node droppable'
    },
    ui,
    hasNodes: false,
    siblings: [{ uid: uid1 }],
    index: 0,
    deleteNode: noop,
    putMoveNode: noop,
    setUIEditing: noop,
    setUIAdding: noop,
    setUIExpanded: noop,
    setUIMovingChild: noop,
    setUIDragging: noop,
    clearUIEditing: noop,
    clearNodeUI: noop,
    updateNodeUI: noop,
    andleClick: noop,
    handleClickMore: noop
  }

  describe('canDrop', () => {

    it('guard against root', () => {

      const putMoveNode = jest.fn()
      const propsDraggable = { ...defaultPropsDraggable, putMoveNode }
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
      expect(putMoveNode.mock.calls.length).toBe(0)
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
      const propsDroppable = { ...defaultPropsDroppable, uid }
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

        const putMoveNode = jest.fn()
        const siblings = [{ uid: uid1 }, { uid }]
        const propsDraggable = { ...defaultPropsDraggable, siblings, index: 1 }
        const propsDroppable = { ...defaultPropsDroppable, siblings, index: 0, hoverRegion: 'bottom', putMoveNode }
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
        expect(putMoveNode.mock.calls.length).toBe(0)

      })

      it('before', () => {

        const putMoveNode = jest.fn()
        const siblings = [{ uid }, { uid: uid1 }]
        const propsDraggable = { ...defaultPropsDraggable, siblings, index: 0 }
        const propsDroppable = { ...defaultPropsDroppable, siblings, index: 1, putMoveNode }
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
        expect(putMoveNode.mock.calls.length).toBe(0)
      })

      it('last child different parent', () => {

        const putMoveNode = jest.fn()
        const siblingsDraggable = [{ uid }]
        const siblingsDroppable = [{ uid: uid2 }, { uid: uid1 }]
        const propsDraggable = { ...defaultPropsDraggable, siblingsDraggable, index: 0 }
        const propsDroppable = { ...defaultPropsDroppable, siblingsDroppable, index: 1, overMousePosition: 'bottom', putMoveNode }
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
        expect(putMoveNode.mock.calls.length).toBe(1)

      })
    })

    it('to call putMoveNode', () => {

      const putMoveNode = jest.fn()
      const propsDraggable = { ...defaultPropsDraggable }
      const propsDroppable = { ...defaultPropsDroppable, putMoveNode }
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
      expect(putMoveNode.mock.calls.length).toBe(1)
    })
  })
})

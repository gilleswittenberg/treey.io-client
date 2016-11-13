import React, { Component } from 'react'
import NodeDroppable from '../../app/components/NodeDroppable'
import NodeDraggable from '../../app/components/NodeDraggable'
import TestBackend from 'react-dnd-test-backend'
import { DragDropContext } from 'react-dnd'
import { mount } from 'enzyme'
import noop from '../noop'

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

  const uid1 = '57bedc40e81b0620300d7691'
  const uid2 = '57bedc40e81b0620300d7692'
  const uid3 = '57bedc40e81b0620300d7693'
  const defaultPropsDraggable = {
    parent: null,
    isRoot: false,
    uid: uid1,
    path: [uid1],
    data: {
      title: 'node draggable'
    },
    siblings: [{ uid: uid1 }],
    index: 0,
    clearNodeUI: noop,
    updateNodeUI: noop,
    handleClick: noop,
    handleClickMore: noop
  }
  const defaultPropsDroppable = {
    parent: null,
    isRoot: false,
    uid: uid2,
    path: [uid2],
    ui: {},
    data: {
      title: 'node droppable'
    },
    hasNodes: false,
    siblings: [{ uid: uid2 }],
    index: 0,
    deleteNode: noop,
    putMoveNode: noop,
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
      const propsDroppable = { ...defaultPropsDroppable, uid: uid1 }
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
        const siblings = [{ uid: uid2 }, { uid: uid1 }]
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
        const siblings = [{ uid: uid1 }, { uid: uid2 }]
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
        const siblingsDraggable = [{ uid: uid1 }]
        const siblingsDroppable = [{ uid: uid3 }, { uid: uid2 }]
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

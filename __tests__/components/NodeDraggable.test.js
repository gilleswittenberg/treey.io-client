/* @flow */

// @TODO: clean up
declare var describe: any
declare var it: any
declare var expect: any
declare var jest: any

import React, { Component } from 'react'
import NodeDraggable from '../../app/components/NodeDraggable'
import TestBackend from 'react-dnd-test-backend'
import { DragDropContext } from 'react-dnd'
import { mount } from 'enzyme'
import noop from '../noop'

// Wraps a component into a DragDropContext that uses the TestBackend.
function wrapInTestContext (DecoratedComponent, props) {
  @DragDropContext(TestBackend)
  class TestContextContainer extends Component {
    render () {
      return <DecoratedComponent { ...props } />
    }
  }
  return TestContextContainer
}

describe('NodeDraggable', () => {

  const uid = '57bedc40e81b0620300d769b'
  const defaultProps = {
    parent: null,
    isRoot: true,
    uid,
    data: {
      title: 'node draggable'
    },
    siblings: [{ uid }],
    index: 0,
    clearNodeUI: noop,
    updateNodeUI: noop,
    handleClick: noop,
    handleClickMore: noop
  }

  it('canDrag', () => {

    const updateNodeUI = jest.fn()

    const props = { ...defaultProps, updateNodeUI }
    const Context = wrapInTestContext(NodeDraggable, props)
    const wrapper = mount(<Context />)
    const manager = wrapper.get(0).getManager()
    const backend = manager.getBackend()
    const nodeDraggable = wrapper.find(NodeDraggable).get(0)
    const sourceId = nodeDraggable.getHandlerId()
    backend.simulateBeginDrag([sourceId])
    expect(updateNodeUI.mock.calls.length).toBe(0)
  })

  it('beginDrag updateNodeUI', () => {

    const updateNodeUI = jest.fn()

    const props = { ...defaultProps, updateNodeUI, isRoot: false }
    const Context = wrapInTestContext(NodeDraggable, props)
    const wrapper = mount(<Context />)
    const manager = wrapper.get(0).getManager()
    const backend = manager.getBackend()
    const nodeDraggable = wrapper.find(NodeDraggable).get(0)
    const sourceId = nodeDraggable.getHandlerId()
    backend.simulateBeginDrag([sourceId])
    expect(updateNodeUI.mock.calls.length).toBe(1)
  })

  it('endDrag clearNodeUI', () => {

    const clearNodeUI = jest.fn()

    const props = { ...defaultProps, clearNodeUI, isRoot: false }
    const Context = wrapInTestContext(NodeDraggable, props)
    const wrapper = mount(<Context />)
    const manager = wrapper.get(0).getManager()
    const backend = manager.getBackend()
    const nodeDraggable = wrapper.find(NodeDraggable).get(0)
    const sourceId = nodeDraggable.getHandlerId()
    backend.simulateBeginDrag([sourceId])
    backend.simulateEndDrag([sourceId])
    // @TODO: test arguments
    expect(clearNodeUI.mock.calls.length).toBe(3)
  })
})

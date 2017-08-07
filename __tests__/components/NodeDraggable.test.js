/* @flow */

// Required for Flow type
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
import { uuid } from '../uuid'

// Wraps a component into a DragDropContext that uses the TestBackend.
function wrapInTestContext (DecoratedComponent, props) {
  @DragDropContext(TestBackend) // eslint-disable-line new-cap
  class TestContextContainer extends Component {
    render () {
      return <DecoratedComponent { ...props } />
    }
  }
  return TestContextContainer
}

describe('NodeDraggable', () => {

  const defaultProps = {
    isRoot: true,
    uuid,
    treePath: [uuid],
    data: { title: 'NodeDraggable' },
    clearUIEditingAdding: noop,
    setUIActive: noop,
    setUIDragging: noop,
    clearUIDragging: noop,
    handleClick: noop,
    handleClickMore: noop
  }

  it('canDrag', () => {

    const setUIDragging = jest.fn()

    const props = { ...defaultProps, setUIDragging }
    const Context = wrapInTestContext(NodeDraggable, props)
    const wrapper = mount(<Context />)
    const manager = wrapper.get(0).getManager()
    const backend = manager.getBackend()
    const nodeDraggable = wrapper.find(NodeDraggable).get(0)
    const sourceId = nodeDraggable.getHandlerId()
    backend.simulateBeginDrag([sourceId])
    expect(setUIDragging.mock.calls.length).toBe(0)
  })

  it('beginDrag setUIDragging', () => {

    const setUIDragging = jest.fn()

    const props = { ...defaultProps, setUIDragging, isRoot: false }
    const Context = wrapInTestContext(NodeDraggable, props)
    const wrapper = mount(<Context />)
    const manager = wrapper.get(0).getManager()
    const backend = manager.getBackend()
    const nodeDraggable = wrapper.find(NodeDraggable).get(0)
    const sourceId = nodeDraggable.getHandlerId()
    backend.simulateBeginDrag([sourceId])
    expect(setUIDragging.mock.calls.length).toBe(1)
  })

  it('endDrag clearUIEditingAdding', () => {

    const clearUIEditingAdding = jest.fn()

    const props = { ...defaultProps, clearUIEditingAdding, isRoot: false }
    const Context = wrapInTestContext(NodeDraggable, props)
    const wrapper = mount(<Context />)
    const manager = wrapper.get(0).getManager()
    const backend = manager.getBackend()
    const nodeDraggable = wrapper.find(NodeDraggable).get(0)
    const sourceId = nodeDraggable.getHandlerId()
    backend.simulateBeginDrag([sourceId])
    backend.simulateEndDrag([sourceId])
    expect(clearUIEditingAdding.mock.calls.length).toBe(1)
  })
})

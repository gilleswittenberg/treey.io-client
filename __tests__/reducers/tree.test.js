/* @flow */

// required for Flow type
declare var describe: any
declare var it: any
declare var expect: any

import reducer, { defaultState } from '../../app/reducers/tree'
import {
  CLEAR_NODE_UI,
  UPDATE_NODE_UI,
  UPDATE_ACTIVE_NODE_UI
} from '../../app/actions/tree'
import defaultUI from '../../app/lib/ui/defaultUI'

describe('nodes tree reducer', () => {

  it('CLEAR_NODE_UI', () => {
    const tree = { nodes: [
      {
        ui: { ...defaultUI, editing: true },
        nodes: []
      }
    ] }
    const state = reducer({ ...defaultState, tree }, { type: CLEAR_NODE_UI, data: { keys: ['editing'] } })
    expect(state.tree).not.toBe(null)
    if (state.tree != null) {
      expect (state.tree.nodes[0].ui.editing).toBe(false)
    }
  })

  it('CLEAR_NODE_UI userIsDragging', () => {
    const tree = { nodes: [
      {
        ui: { ...defaultUI, dragging: true },
        nodes: []
      }
    ] }
    const state = reducer({ ...defaultState, tree, userIsDragging: true }, { type: CLEAR_NODE_UI, data: { keys: ['dragging'] } })
    expect(state.tree).not.toBe(null)
    if (state.tree != null) {
      expect (state.tree.nodes[0].ui.dragging).toBe(false)
    }
    expect (state.userIsDragging).toBe(false)
  })

  it('UPDATE_NODE_UI', () => {
    const tree = { nodes: [
      {
        ui: { ...defaultUI },
        nodes: []
      }
    ] }
    const state = reducer({ ...defaultState, tree }, { type: UPDATE_NODE_UI, data: { indexPath: [0], key: 'editing', value: true } })
    expect(state.tree).not.toBe(null)
    if (state.tree != null) {
      expect (state.tree.nodes[0].ui.editing).toBe(true)
    }
  })

  it('UPDATE_NODE_UI dragging', () => {
    const tree = { nodes: [
      {
        ui: { ...defaultUI },
        nodes: []
      }
    ] }
    const state = reducer({ ...defaultState, tree }, { type: UPDATE_NODE_UI, data: { indexPath: [0], key: 'dragging', value: true } })
    expect(state.tree).not.toBe(null)
    if (state.tree != null) {
      expect (state.tree.nodes[0].ui.dragging).toBe(true)
    }
    expect (state.userIsDragging).toBe(true)
  })

  it('UPDATE_ACTIVE_NODE_UI', () => {
    const tree = { nodes: [
      {
        ui: { ...defaultUI, active: true },
        nodes: []
      }
    ] }
    const activeIndexPath = [0]
    const state = reducer({ ...defaultState, tree, activeIndexPath }, { type: UPDATE_ACTIVE_NODE_UI, data: { key: 'editing', value: true } })
    expect(state.tree).not.toBe(null)
    if (state.tree != null) {
      expect (state.tree.nodes[0].ui.editing).toBe(true)
    }
  })
})

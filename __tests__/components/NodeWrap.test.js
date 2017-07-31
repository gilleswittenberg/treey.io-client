/* @flow */

// Required for Flow type
declare var describe: any
declare var it: any
declare var expect: any

import NodeWrap from '../../app/components/NodeWrap'
import { shallow } from 'enzyme'
import getComponentHOF from '../getComponent'
import noop from '../noop'
import defaultUI from '../../app/lib/ui/defaultUI'
import { parent, uuid } from '../uuid'

describe('NodeWrap', () => {

  const ui = defaultUI

  const defaultProps = {
    app: { enableDnD: false },
    parent,
    uuid,
    treePath: [],
    data: {
      title: ''
    },
    ui,
    isRoot: false,
    nodes: [],
    siblings: [],
    index: 0,
    clearUIEditingAdding: noop,
    update: noop,
    remove: noop,
    move: noop
  }

  const getComponent = getComponentHOF(NodeWrap, defaultProps)

  describe('construct', () => {

    it('Node', () => {
      const wrapper = shallow(getComponent())
      expect(wrapper.find('NodeDroppableDecorated').length).toBe(1)
    })

    it('Nodes', () => {
      const wrapper = shallow(getComponent())
      expect(wrapper.find('Nodes').length).toBe(1)
    })
  })

  describe('isRoot', () => {

    it('root', () => {
      const wrapper = shallow(getComponent({ isRoot: true }))
      expect(wrapper.find('div.-is-root').length).toBe(1)
    })

    it('non-root', () => {
      const wrapper = shallow(getComponent())
      expect(wrapper.find('div.-is-root').length).toBe(0)
    })
  })


  describe('isEditing', () => {

    it('false', () => {
      const wrapper = shallow(getComponent())
      expect(wrapper.find('NodeEdit').length).toBe(0)
    })

    it('true', () => {
      const wrapper = shallow(getComponent({ app: { enableDnD: false }, ui: { ...ui, editing: [] } }))
      expect(wrapper.find('NodeEdit').length).toBe(1)
    })
  })
})

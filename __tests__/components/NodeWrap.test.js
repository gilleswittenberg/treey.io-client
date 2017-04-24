/* @flow */

// required for Flow type
declare var describe: any
declare var it: any
declare var expect: any

import NodeWrap from '../../app/components/NodeWrap'
import { shallow } from 'enzyme'
import getComponentHOF from '../getComponent'
import noop from '../noop'
import defaultUI from '../../app/lib/ui/defaultUI'
import { parent, uid } from '../uid'

describe('NodeWrap', () => {

  const ui = defaultUI

  const defaultProps = {
    app: { enableDnD: false },
    parent,
    uid,
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

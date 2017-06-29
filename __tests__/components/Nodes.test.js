/* @flow */

// Required for Flow type
declare var describe: any
declare var it: any
declare var expect: any

import Nodes from '../../app/components/Nodes'
import { shallow } from 'enzyme'
import getComponentHOF from '../getComponent'
import noop from '../noop'
import defaultUI from '../../app/lib/ui/defaultUI'
import { parent, uuid, uuid1, uuid2 } from '../uuid'

describe('Nodes', () => {

  const app = { enableDnD: false }
  const ui = defaultUI

  const defaultProps = {
    app,
    parent: null,
    nodesArray: [],
    treePath: [],
    nodes: [],
    ui,
    clearUIEditingAdding: noop,
    setUIAdding: noop,
    setUIExpanded: noop,
    create: noop
  }
  const getComponent = getComponentHOF(Nodes, defaultProps)

  describe('root', () => {

    it('root', () => {
      const wrapper = shallow(getComponent())
      expect(wrapper.find('NodeWrap').length).toBe(0)
    })

    it('no root', () => {
      const wrapper = shallow(getComponent({ parent }))
      expect(wrapper.find('NodeAdd').length).toBe(1)
    })
  })

  describe('nodes', () => {

    it('nodes', () => {
      const nodes = [uuid, uuid1]
      const nodesArray = [{
        uuid,
        data: { title: '' },
        ui,
        path: [uuid],
        nodes: []
      }, {
        uuid: uuid1,
        data: { title: '' },
        ui,
        path: [uuid1],
        nodes: []
      }]
      const wrapper = shallow(getComponent({ nodes, nodesArray }))
      expect(wrapper.find('li').length).toBe(2)
    })

    it('non findable nodes', () => {
      const nodes = [uuid, uuid1, uuid2]
      const nodesArray = [{
        uuid,
        data: { title: '' },
        ui,
        path: [uuid],
        nodes: []
      }, {
        uuid: uuid1,
        data: { title: '' },
        ui,
        path: [uuid1],
        nodes: []
      }]
      const wrapper = shallow(getComponent({ nodes, nodesArray }))
      expect(wrapper.find('li').length).toBe(2)
    })
  })
})

/* @flow */

// required for Flow type
declare var describe: any
declare var it: any
declare var expect: any

import Nodes from '../../app/components/Nodes'
import { shallow } from 'enzyme'
import getComponentHOF from '../getComponent'
import noop from '../noop'
import defaultUI from '../../app/lib/ui/defaultUI'
import { parent, uid, uid1 } from '../uid'

describe('Nodes', () => {

  const app = { enableDnD: false }
  const ui = defaultUI

  const defaultProps = {
    app,
    parent: null,
    nodesArray: [],
    path: [],
    nodes: [],
    ui,
    clearUIEditingAdding: noop,
    setUIAdding: noop,
    setUIExpanded: noop,
    postNode: noop
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
      const nodes = [uid, uid1]
      const nodesArray = [{
        uid,
        data: { title: '' },
        ui,
        path: [uid],
        nodes: []
      }, {
        uid: uid1,
        data: { title: '' },
        ui,
        path: [uid1],
        nodes: []
      }]
      const wrapper = shallow(getComponent({ nodes, nodesArray }))
      expect(wrapper.find('li').length).toBe(2)
    })
  })
})

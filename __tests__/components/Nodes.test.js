import Nodes from '../../app/components/Nodes'
import { shallow } from 'enzyme'
import getComponentHOF from '../getComponent'
import noop from '../noop'
import { defaultNodeUI } from '../../app/lib/TreeParse'

describe('Nodes', () => {

  const app = { enableDnD: false }
  const parent = '57bedc40e81b0620300d769a'
  const ui = defaultNodeUI
  const uid1 = '57bedc40e81b0620300d769b'
  const uid2 = '57bedc40e81b0620300d769c'

  const defaultProps = {
    app,
    parent: null,
    path: [],
    nodes: [],
    ui,
    clearNodeUI: noop,
    updateNodeUI: noop,
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
      const nodes = [{ uid: uid1, path: [uid1], ui }, { uid: uid2, path: [uid2], ui }]
      const wrapper = shallow(getComponent({ nodes }))
      expect(wrapper.find('li').length).toBe(2)
    })
  })
})

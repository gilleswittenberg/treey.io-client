import Nodes from '../../app/components/Nodes'
import { shallow } from 'enzyme'
import getComponentHOF from '../getComponent'

describe('Nodes', () => {

  const parent = '57bedc40e81b0620300d769a'
  const uid1 = '57bedc40e81b0620300d769b'
  const uid2 = '57bedc40e81b0620300d769c'
  const noop = () => {}

  const defaultProps = {
    ui: {},
    actions: {
      setIsEditing: noop,
      unsetIsEditing: noop,
      expand: noop,
      postNode: noop
    },
    parent: null,
    nodes: []
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
      const nodes = [{ uid: uid1 }, { uid: uid2 }]
      const wrapper = shallow(getComponent({ nodes }))
      expect(wrapper.find('li').length).toBe(2)
    })
  })
})

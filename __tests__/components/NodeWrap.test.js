import NodeWrap from '../../app/components/NodeWrap'
import { shallow } from 'enzyme'
import getComponentHOF from '../getComponent'
import noop from '../noop'

describe('NodeWrap', () => {

  const parent = '57bedc40e81b0620300d769a'
  const uid = '57bedc40e81b0620300d769b'

  const defaultProps = {
    app: { enableDnD: false },
    parent,
    uid,
    path: [uid],
    data: {
      title: ''
    },
    ui: {},
    isRoot: false,
    nodes: [],
    siblings: [],
    index: 0,
    clearNodeUI: noop,
    updateNodeUI: noop,
    putNode: noop,
    postNode: noop,
    deleteNode: noop,
    putMoveNode: noop
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
      const wrapper = shallow(getComponent({ app: { enableDnD: false }, ui: { editing: true } }))
      expect(wrapper.find('NodeEdit').length).toBe(1)
    })
  })
})

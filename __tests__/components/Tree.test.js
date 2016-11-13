import Tree from '../../app/components/Tree'
import { shallow, render } from 'enzyme'
import getComponentHOF from '../getComponent'
import noop from '../noop'
import { defaultActions } from '../../app/lib/actions'

describe('Tree', () => {

  const uid1 = '57bedc40e81b0620300d7691'
  const uid2 = '57bedc40e81b0620300d7692'

  const defaultProps = {
    ui: {
      lang: 'en',
      enableDnD: false
    },
    ...defaultActions,
    tree: null,
    updateNodeUI: noop,
    unsetIsEditing: noop
  }
  const getComponent = getComponentHOF(Tree.DecoratedComponent, defaultProps)

  describe('index', () => {

    it('null', () => {
      const wrapper = shallow(getComponent())
      expect(wrapper.find('Nodes').length).toBe(0)
    })

    it('nodes', () => {
      const tree = {
        uid: uid1,
        path: [uid1],
        nodes: [{
          uid: uid2,
          path: [uid1, uid2]
        }],
        nodeUi: {}
      }
      const wrapper = shallow(getComponent({ tree }))
      expect(wrapper.find('Nodes').length).toBe(1)
    })

    it('nodes deep', () => {
      const tree = {
        uid: '57bedc40e81b0620300d769a',
        path: ['57bedc40e81b0620300d769a'],
        data: {
          title: 'John Doe'
        },
        nodeUi: {},
        nodes: [
          {
            uid: '57bedc40e81b0620300d769b',
            path: ['57bedc40e81b0620300d769a', '57bedc40e81b0620300d769b'],
            data: {
              title: 'ToDo'
            },
            nodeUi: {},
            nodes: [
              {
                uid: '57ebc46eb0bf9b00106a3c5e',
                path: ['57bedc40e81b0620300d769a', '57bedc40e81b0620300d769b', '57ebc46eb0bf9b00106a3c5e'],
                data: { title: 'bring home the milk' },
                nodeUi: {}
              },
              {
                uid: '57ebc46eb0bf9b00106a3c5f',
                path: ['57bedc40e81b0620300d769a', '57bedc40e81b0620300d769b', '57ebc46eb0bf9b00106a3c5f'],
                data: { title: 'clean the house' },
                nodeUi: {} }
            ]
          },
          {
            uid: '57bedc40e81b0620300d769c',
            path: ['57bedc40e81b0620300d769a', '57bedc40e81b0620300d769c'],
            data: {
              title: 'Movies'
            },
            nodeUi: {},
            nodes: [
              {
                uid: '57ebc46eb0bf9b00106a3c60',
                path: ['57bedc40e81b0620300d769a', '57bedc40e81b0620300d769c', '57ebc46eb0bf9b00106a3c60'],
                data: { title: 'Star Wars: Episode IV - A New Hope (1977)' },
                nodeUi: {}
              },
              {
                uid: '57ebc46eb0bf9b00106a3c62',
                path: ['57bedc40e81b0620300d769a', '57bedc40e81b0620300d769c', '57ebc46eb0bf9b00106a3c62'],
                data: { title: 'The Terminator (1984)' },
                nodeUi: {}
              },
              {
                uid: '57ebc46eb0bf9b00106a3c61',
                path: ['57bedc40e81b0620300d769a', '57bedc40e81b0620300d769c', '57ebc46eb0bf9b00106a3c61'],
                data: { title: 'The Matrix (1999)' },
                nodeUi: {}
              }
            ]
          }
        ]
      }
      const wrapper = render(getComponent({ tree }))
      // deepest child nodes 3 + 2
      expect(wrapper.find('ul ul ul ul').length).toBe(3 + 2)
    })

    it('componentWillReceiveProps', () => {

      const updateNodeUI = jest.fn()
      const wrapper = shallow(getComponent({ updateNodeUI }))
      const tree = { uid: uid1 }
      wrapper.setProps({ tree })
      // @TODO: Add tests for arguments updateNodeUI
      expect(updateNodeUI.mock.calls.length).toBe(2)
    })
  })
})

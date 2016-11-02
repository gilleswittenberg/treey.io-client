import { Tree } from '../../app/components/Tree'
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
    actions: defaultActions,
    tree: null,
    unsetIsEditing: noop
  }
  const getComponent = getComponentHOF(Tree, defaultProps)

  describe('index', () => {

    it('null', () => {
      const wrapper = shallow(getComponent())
      expect(wrapper.find('Nodes').length).toBe(0)
    })

    it('nodes', () => {
      const tree = {
        uid: uid1,
        nodes: [uid2]
      }
      const wrapper = shallow(getComponent({ tree }))
      expect(wrapper.find('Nodes').length).toBe(1)
    })

    it('nodes deep', () => {
      const tree = {
        uid: '57bedc40e81b0620300d769a',
        title: 'John Doe',
        nodes: [
          {
            uid: '57bedc40e81b0620300d769b',
            title: 'ToDo',
            nodes: [
              { uid: '57ebc46eb0bf9b00106a3c5e', title: 'bring home the milk' },
              { uid: '57ebc46eb0bf9b00106a3c5f', title: 'clean the house' }
            ]
          },
          {
            uid: '57bedc40e81b0620300d769c',
            title: 'Movies',
            nodes: [
              { uid: '57ebc46eb0bf9b00106a3c60', title: 'Star Wars: Episode IV - A New Hope (1977)' },
              { uid: '57ebc46eb0bf9b00106a3c62', title: 'The Terminator (1984)' },
              { uid: '57ebc46eb0bf9b00106a3c61', title: 'The Matrix (1999)' }
            ]
          }
        ]
      }
      const wrapper = render(getComponent({ tree }))
      // deepest child nodes 3 + 2
      expect(wrapper.find('ul ul ul ul').length).toBe(3 + 2)
    })
  })
})

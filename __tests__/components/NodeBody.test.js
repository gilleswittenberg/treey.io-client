import NodeBody from '../../app/components/NodeBody'
import { shallow, mount } from 'enzyme'
import getComponentHOF from '../getComponent'

describe('NodeBody', () => {

  const ui = {}
  const lang = 'en'
  const parent = '57bedc40e81b0620300d769a'
  const uid = '57bedc40e81b0620300d769b'
  const noop = () => {}

  const defaultProps = {
    ui,
    lang,
    parent,
    isRoot: false,
    uid,
    title: '',
    nodes: [],
    unsetIsEditing: noop,
    setIsEditing: noop,
    toggleExpanded: noop,
    deleteNode: noop,
    setShowButtons: noop
  }
  const getComponent = getComponentHOF(NodeBody, defaultProps)

  describe('handleClick', () => {

    it('altKey', () => {
      const setIsEditing = jest.fn()
      const wrapper = shallow(getComponent({ setIsEditing }))
      const mockEvent = { altKey: true }
      wrapper.find('div.node-content').simulate('click', mockEvent)
      expect(setIsEditing.mock.calls.length).toBe(1)
    })

    it('canExpand', () => {
      const toggleExpanded = jest.fn()
      const wrapper = shallow(getComponent({ toggleExpanded }))
      wrapper.find('div.node-content').simulate('click', {})
      expect(toggleExpanded.mock.calls.length).toBe(0)
    })

    it('toggleExpanded', () => {
      const toggleExpanded = jest.fn()
      const wrapper = shallow(getComponent({ nodes: [1], toggleExpanded }))
      wrapper.find('div.node-content').simulate('click', {})
      expect(toggleExpanded.mock.calls.length).toBe(1)
    })
  })

  describe('startIsEditing', () => {

    it('handleClickEdit', () => {
      const setIsEditing = jest.fn()
      const wrapper = mount(getComponent({ setIsEditing }))
      wrapper.find('.button-icon-edit').simulate('click')
      expect(setIsEditing.mock.calls.length).toBe(1)
    })

    it('handleClickAdd', () => {
      const setIsEditing = jest.fn()
      const wrapper = mount(getComponent({ setIsEditing, showAddButton: true }))
      wrapper.find('.button-icon-add').simulate('click')
      expect(setIsEditing.mock.calls.length).toBe(1)
      expect(setIsEditing.mock.calls[0][1]).toEqual('add')
    })
  })

  describe('handleClickDelete', () => {

    it('non root', () => {
      const deleteNode = jest.fn()
      const wrapper = mount(getComponent({
        deleteNode
      }))
      wrapper.find('.button-icon-delete').simulate('click')
      expect(deleteNode.mock.calls.length).toBe(1)
    })

    it('root', () => {
      const wrapper = mount(getComponent({ isRoot: true }))
      expect(wrapper.find('.button-icon-delete').length).toBe(0)
    })
  })

  describe('handleClickShowButtons', () => {

    it('click', () => {
      const setShowButtons = jest.fn()
      const wrapper = mount(getComponent({ setShowButtons }))
      const eventMock = { stopPropagation: noop }
      wrapper.find('.button-icon-more').simulate('click', eventMock)
      expect(setShowButtons.mock.calls.length).toBe(1)
    })
  })

  describe('content', () => {

    it('text', () => {
      const wrapper = shallow(getComponent({ title: 'text' }))
      expect(wrapper.find('a').length).toBe(0)
    })

    it('URL', () => {
      const wrapper = shallow(getComponent({ title: 'http://treey.io' }))
      expect(wrapper.find('a').length).toBe(1)
    })
  })
})

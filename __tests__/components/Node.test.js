import Node from '../../app/components/Node'
import { shallow, mount } from 'enzyme'
import getComponentHOF from '../getComponent'
import noop from '../noop'

describe('Node', () => {

  const ui = {}
  const lang = 'en'
  const parent = '57bedc40e81b0620300d769a'
  const uid = '57bedc40e81b0620300d769b'

  const defaultProps = {
    ui,
    actions: {
      unsetIsEditing: noop,
      setIsDragging: noop,
      unsetIsDragging: noop
    },
    lang,
    parent,
    isRoot: false,
    uid,
    title: '',
    hasNodes: false,
    unsetIsEditing: noop,
    setIsEditing: noop,
    toggleExpanded: noop,
    deleteNode: noop,
    setShowButtons: noop
  }
  const getComponent = getComponentHOF(Node, defaultProps)

  describe('handleClick', () => {

    it('altKey', () => {
      const setIsEditing = jest.fn()
      const node = new Node({ setIsEditing })
      const mockEvent = { altKey: true }
      node.handleClick(mockEvent)
      expect(setIsEditing.mock.calls.length).toBe(1)
    })

    it('canExpand', () => {
      const toggleExpanded = jest.fn()
      const unsetIsEditing = noop
      const node = new Node({ unsetIsEditing, toggleExpanded })
      const mockEvent = {}
      node.handleClick(mockEvent)
      expect(toggleExpanded.mock.calls.length).toBe(0)
    })

    it('toggleExpanded', () => {
      const toggleExpanded = jest.fn()
      const unsetIsEditing = noop
      const node = new Node({ hasNodes: true, unsetIsEditing, toggleExpanded })
      const mockEvent = {}
      node.handleClick(mockEvent)
      expect(toggleExpanded.mock.calls.length).toBe(1)
    })
  })

  xdescribe('startIsEditing', () => {

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

  xdescribe('handleClickDelete', () => {

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

  xdescribe('handleClickShowButtons', () => {

    it('click', () => {
      const setShowButtons = jest.fn()
      const wrapper = mount(getComponent({ setShowButtons }))
      const eventMock = { stopPropagation: noop }
      wrapper.find('.button-icon-more').simulate('click', eventMock)
      expect(setShowButtons.mock.calls.length).toBe(1)
    })
  })

  xdescribe('content', () => {

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

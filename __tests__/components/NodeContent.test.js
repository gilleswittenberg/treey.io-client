/* @flow */

// Required for Flow type
declare var describe: any
declare var it: any
declare var expect: any

import NodeContent from '../../app/components/NodeContent'
import { shallow } from 'enzyme'
import getComponentHOF from '../getComponent'
import noop from '../noop'
import { uuid } from '../uuid'

describe('Node', () => {

  const defaultProps = {
    lang: 'en',
    title: '',
    handleClick: noop,
    handleClickMore: noop,
    uuid
  }
  const getComponent = getComponentHOF(NodeContent, defaultProps)

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

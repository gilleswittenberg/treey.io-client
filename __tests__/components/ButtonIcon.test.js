/* @flow */

// required for Flow type
declare var describe: any
declare var it: any
declare var expect: any

import ButtonIcon from '../../app/components/ButtonIcon'
import { shallow } from 'enzyme'
import getComponentHOF from '../getComponent'

describe('Node', () => {

  const defaultProps = { lang: 'en' }
  const getComponent = getComponentHOF(ButtonIcon, defaultProps)

  describe('type', () => {

    it('MOVE_CHILD', () => {
      const wrapper = shallow(getComponent({ type: 'MOVE_CHILD' }))
      expect(wrapper.hasClass('button-icon-move-child')).toBe(true)
      expect(wrapper.find('.button-icon').props().title).not.toContain('_')
    })
  })
})

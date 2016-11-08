import { isActive, isEditing, isDragging, hasButtonsShown, isExpanded } from '../../app/reducers/ui'

describe('ui reducer helper methods', () => {

  const uid1 = '57bedc40e81b0620300d7691'
  const uid2 = '57bedc40e81b0620300d7692'

  describe('isActive', () => {

    it('null state', () => {
      const state = { active: null }
      expect(isActive(state, uid1)).toBe(false)
    })

    it('null uid', () => {
      const state = { active: uid1 }
      expect(isActive(state, null)).toBe(false)
    })

    it('different uid', () => {
      const state = { active: uid1 }
      expect(isActive(state, uid2)).toBe(false)
    })

    it('true', () => {
      const state = { active: uid1 }
      expect(isActive(state, uid1)).toBe(true)
    })
  })

  describe('isEditing', () => {

    it('null state', () => {
      const state = { editing: null }
      expect(isEditing(state, uid1)).toBe(false)
    })

    it('null uid', () => {
      const state = { editing: uid1 }
      expect(isEditing(state, null)).toBe(false)
    })

    it('different uid', () => {
      const state = { editing: uid1 }
      expect(isEditing(state, uid2)).toBe(false)
    })

    it('true', () => {
      const state = { editing: uid1 }
      expect(isEditing(state, uid1)).toBe(true)
    })

    it('type add false', () => {
      const state = { editing: uid1 }
      expect(isEditing(state, uid1, 'add')).toBe(false)
    })

    it('type add true', () => {
      const state = { editing: `${ uid1 }.add` }
      expect(isEditing(state, uid1, 'add')).toBe(true)
    })
  })

  describe('isDragging', () => {

    it('null state', () => {
      const state = { dragging: null }
      expect(isDragging(state, uid1)).toBe(false)
    })

    it('null uid', () => {
      const state = { dragging: uid1 }
      expect(isDragging(state, null)).toBe(false)
    })

    it('different uid', () => {
      const state = { dragging: uid1 }
      expect(isDragging(state, uid2)).toBe(false)
    })

    it('true', () => {
      const state = { dragging: uid1 }
      expect(isDragging(state, uid1)).toBe(true)
    })
  })

  describe('hasButtonsShown', () => {

    it('null state', () => {
      const state = { showButtons: null }
      expect(hasButtonsShown(state, uid1)).toBe(false)
    })

    it('null uid', () => {
      const state = { showButtons: uid1 }
      expect(hasButtonsShown(state, null)).toBe(false)
    })

    it('different uid', () => {
      const state = { showButtons: uid1 }
      expect(hasButtonsShown(state, uid2)).toBe(false)
    })

    it('true', () => {
      const state = { showButtons: uid1 }
      expect(hasButtonsShown(state, uid1)).toBe(true)
    })
  })

  describe('isExpanded', () => {

    it('empty state', () => {
      const state = { expanded: [] }
      expect(isExpanded(state, uid1)).toBe(false)
    })

    it('null uid', () => {
      const state = { expanded: [uid1] }
      expect(isExpanded(state, null)).toBe(false)
    })

    it('different uid', () => {
      const state = { expanded: [uid1] }
      expect(isExpanded(state, uid2)).toBe(false)
    })

    it('true', () => {
      const state = { expanded: [uid1, uid2] }
      expect(isExpanded(state, uid1)).toBe(true)
    })
  })
})

/* @flow */

// required for Flow type
declare var describe: any
declare var it: any
declare var expect: any

import createTransaction from '../../../app/lib/tree/createTransaction'
import { uid, uid1, uid2 } from '../../uid'

describe('createTransaction', () => {

  it('invalid', () => {
    const transaction = createTransaction()
    expect(transaction).toBe(null)
  })

  describe('CREATE', () => {

    it('valid', () => {
      const transaction = createTransaction('CREATE')
      expect(transaction.type).toBe('CREATE')
      expect(transaction.uuid.length).toBe(36)
      expect(transaction.uid.length).toBe(24) // MongoDB ObjectId
      expect(transaction.status).toBe('PENDING')
    })
  })

  describe('SET', () => {

    it('valid', () => {
      const transaction = createTransaction('SET', uid, { title: 'Mr. Foo' })
      expect(transaction.type).toBe('SET')
      expect(transaction.uuid.length).toBe(36)
      expect(transaction.status).toBe('PENDING')
      expect(transaction.uid).toBe(uid)
      expect(transaction.data).toEqual({ title: 'Mr. Foo' })
    })
  })

  describe('REMOVE_CHILD', () => {

    it('valid', () => {
      const transaction = createTransaction('REMOVE_CHILD', uid, undefined, uid1)
      expect(transaction.type).toBe('REMOVE_CHILD')
      expect(transaction.uuid.length).toBe(36)
      expect(transaction.status).toBe('PENDING')
      expect(transaction.uid).toEqual(uid)
      expect(transaction.childUid).toEqual(uid1)
    })
  })

  describe('ADD_CHILD', () => {

    it('valid', () => {
      const transaction = createTransaction('ADD_CHILD', uid, undefined, uid1, uid2)
      expect(transaction.type).toBe('ADD_CHILD')
      expect(transaction.uuid.length).toBe(36)
      expect(transaction.status).toBe('PENDING')
      expect(transaction.uid).toEqual(uid)
      expect(transaction.childUid).toEqual(uid1)
      expect(transaction.before).toEqual(uid2)
    })
  })
})

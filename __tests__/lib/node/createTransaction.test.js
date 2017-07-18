/* @flow */

// Required for Flow type
declare var describe: any
declare var it: any
declare var expect: any

import createTransaction from '../../../app/lib/node/createTransaction'
import { uuid, uuid1, uuid2 } from '../../uuid'

describe('createTransaction', () => {

  describe('CREATE', () => {

    it('valid', () => {
      const transaction = createTransaction('CREATE')
      expect(transaction).not.toBe(null)
      if (transaction != null) {
        expect(transaction.type).toBe('CREATE')
        expect(transaction.uuid.length).toBe(36)
        expect(transaction.node.length).toBe(36)
        expect(transaction.status).toBe('PENDING')
        expect(transaction.modified).toBeInstanceOf(Date)
        expect(transaction.created).toBeInstanceOf(Date)
        expect(transaction.modified).toEqual(transaction.created)
      }
    })
  })

  describe('SET', () => {

    it('valid', () => {
      const transaction = createTransaction('SET', uuid, { title: 'Mr. Foo' })
      expect(transaction.type).toBe('SET')
      expect(transaction.uuid.length).toBe(36)
      expect(transaction.status).toBe('PENDING')
      expect(transaction.node).toBe(uuid)
      expect(transaction.data).toEqual({ title: 'Mr. Foo' })
      expect(transaction.modified).toBeInstanceOf(Date)
      expect(transaction.created).toBeInstanceOf(Date)
      expect(transaction.modified).toEqual(transaction.created)
    })
  })

  describe('REMOVE_CHILD', () => {

    it('valid', () => {
      const transaction = createTransaction('REMOVE_CHILD', uuid, undefined, uuid1)
      expect(transaction.type).toBe('REMOVE_CHILD')
      expect(transaction.uuid.length).toBe(36)
      expect(transaction.status).toBe('PENDING')
      expect(transaction.node).toEqual(uuid)
      expect(transaction.child).toEqual(uuid1)
      expect(transaction.modified).toBeInstanceOf(Date)
      expect(transaction.created).toBeInstanceOf(Date)
      expect(transaction.modified).toEqual(transaction.created)
    })
  })

  describe('ADD_CHILD', () => {

    it('valid', () => {
      const transaction = createTransaction('ADD_CHILD', uuid, undefined, uuid1, uuid2)
      expect(transaction.type).toBe('ADD_CHILD')
      expect(transaction.uuid.length).toBe(36)
      expect(transaction.status).toBe('PENDING')
      expect(transaction.node).toEqual(uuid)
      expect(transaction.child).toEqual(uuid1)
      expect(transaction.before).toEqual(uuid2)
      expect(transaction.modified).toBeInstanceOf(Date)
      expect(transaction.created).toBeInstanceOf(Date)
      expect(transaction.modified).toEqual(transaction.created)
    })
  })
})

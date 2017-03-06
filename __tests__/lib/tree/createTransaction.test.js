/* @flow */

// required for Flow type
declare var describe: any
declare var it: any
declare var expect: any

import createTransaction from '../../../app/lib/tree/createTransaction'

describe('createTransaction', () => {

  it('invalid', () => {
    const transaction = createTransaction()
    expect(transaction).toBe(null)
  })

  describe('SET', () => {

    it('valid', () => {
      const transaction = createTransaction('SET', { title: 'Mr. Foo' })
      expect(transaction.type).toBe('SET')
      expect(transaction.uuid.length).toBe(36)
      expect(transaction.data).toEqual({ title: 'Mr. Foo' })
      expect(transaction.status).toBe('PENDING')
    })
  })
})

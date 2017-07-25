/* @flow */

// Required for Flow type
declare var describe: any
declare var it: any
declare var expect: any

import setTransactionsIsOverridden from '../../../app/lib/node/setTransactionsIsOverridden'
import createTransaction from '../../../app/lib/node/createTransaction'
import { uuid, uuid1, uuid2, uuid3 } from '../../uuid'

describe('setTransactionsIsOverridden', () => {

  describe('CREATE', () => {

    it('isOverridden', () => {
      const transaction = createTransaction('CREATE')
      const transactions = [transaction]
      const transactionIsOverridden = setTransactionsIsOverridden(transactions)
      expect(transactionIsOverridden[0].isOverridden).toBe(false)
    })
  })

  describe('SET', () => {

    it('only last isOverridden', () => {
      const transaction0 = createTransaction('SET')
      const transaction1 = createTransaction('SET')
      const transactions = [transaction0, transaction1]
      const transactionIsOverridden = setTransactionsIsOverridden(transactions)
      expect(transactionIsOverridden[0].isOverridden).toBe(true)
      expect(transactionIsOverridden[1].isOverridden).toBe(false)
    })
  })

  describe('CHILDREN', () => {

    it('REMOVE_CHILD, ADD_CHILD cancel each other out', () => {
      const transaction0 = createTransaction('ADD_CHILD', uuid, undefined, uuid1)
      const transaction1 = createTransaction('REMOVE_CHILD', uuid, undefined, uuid1)
      const transactions = [transaction0, transaction1]
      const transactionIsOverridden = setTransactionsIsOverridden(transactions)
      expect(transactionIsOverridden[0].isOverridden).toBe(true)
      expect(transactionIsOverridden[1].isOverridden).toBe(true)
    })

    it('ADD_CHILD', () => {
      const transaction0 = createTransaction('ADD_CHILD', uuid, undefined, uuid1)
      const transaction1 = createTransaction('ADD_CHILD', uuid, undefined, uuid2)
      const transactions = [transaction0, transaction1]
      const transactionIsOverridden = setTransactionsIsOverridden(transactions)
      expect(transactionIsOverridden[0].isOverridden).toBe(false)
      expect(transactionIsOverridden[1].isOverridden).toBe(false)
    })

    it('multiple', () => {
      const transaction0 = createTransaction('ADD_CHILD', uuid, undefined, uuid1)
      const transaction1 = createTransaction('ADD_CHILD', uuid, undefined, uuid2)
      const transaction2 = createTransaction('ADD_CHILD', uuid, undefined, uuid3)
      const transaction3 = createTransaction('REMOVE_CHILD', uuid, undefined, uuid3)
      const transactions = [transaction0, transaction1, transaction2, transaction3]
      const transactionIsOverridden = setTransactionsIsOverridden(transactions)
      expect(transactionIsOverridden[0].isOverridden).toBe(false)
      expect(transactionIsOverridden[1].isOverridden).toBe(false)
      expect(transactionIsOverridden[2].isOverridden).toBe(true)
      expect(transactionIsOverridden[3].isOverridden).toBe(true)
    })
  })
})

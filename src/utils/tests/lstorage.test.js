import { getCashierTrans, putStorageKey, removeAllKey, getIdBE, getDomainBE, getPortBE, removeItemKeys, removeItemKey, getItem, setCashierTrans } from '../lstorage'

it('Return Cashier Trans LocalStorage', () => {
  const arrayItem = [
    {
      no: 1,
      bundleId: 1,
      employeeId: 1,
      employeeName: 1,
      productId: 1,
      code: 'TEST ITEM 1',
      name: 'TEST ITEM 1 NAME',
      qty: 5,
      typeCode: 'P',
      sellPrice: 50000,
      price: 40000,
      discount: 0,
      disc1: 0,
      disc2: 0,
      disc3: 0,
      total: 200000
    }
  ]
  setCashierTrans(JSON.stringify(arrayItem))
  expect(getCashierTrans()).toEqual(arrayItem)
})

it('Should return reset all localStorage ', () => {
  removeAllKey()
  const data = getItem('setting')
  expect(data).toEqual({})
})

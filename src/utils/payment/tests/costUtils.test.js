import {
  generateListBank,
  checkBankActive
} from '../index'

const listBank = [
  {
    id: 1,
    bankCode: 'BCA',
    bankName: 'BANK BCA',
    chargeFee: 0,
    chargeFeePercent: 0,
    status: 1
  },
  {
    id: 2,
    bankCode: 'MANDIRI',
    bankName: 'BANK MANDIRI',
    chargeFee: 0,
    chargeFeePercent: 0,
    status: 1
  }
]

const listPayment = [
  {
    id: 1,
    machineId: 1,
    bankId: 1,
    chargeNominal: 2000,
    chargePercent: 10,
    active: true
  }
]

it('should render the right list of cost', () => {
  expect(generateListBank(listBank, listPayment)).toEqual([
    {
      id: 1,
      bankCode: 'BCA',
      bankName: 'BANK BCA',
      chargeFee: 0,
      chargeFeePercent: 0,
      status: 1,
      active: true
    },
    {
      id: 2,
      bankCode: 'MANDIRI',
      bankName: 'BANK MANDIRI',
      chargeFee: 0,
      chargeFeePercent: 0,
      status: 1,
      active: false
    }
  ])
})

it('should render the all listBank active=false', () => {
  expect(generateListBank(listBank, undefined)).toEqual([
    {
      id: 1,
      bankCode: 'BCA',
      bankName: 'BANK BCA',
      chargeFee: 0,
      chargeFeePercent: 0,
      status: 1,
      active: false
    },
    {
      id: 2,
      bankCode: 'MANDIRI',
      bankName: 'BANK MANDIRI',
      chargeFee: 0,
      chargeFeePercent: 0,
      status: 1,
      active: false
    }
  ])
})

it('Test when id of bank is not provided', () => {
  const listBank = [
    {
      bankCode: 'BCA',
      bankName: 'BANK BCA',
      chargeFee: 0,
      chargeFeePercent: 0,
      status: 1
    },
    {
      bankCode: 'MANDIRI',
      bankName: 'BANK MANDIRI',
      chargeFee: 0,
      chargeFeePercent: 0,
      status: 1
    }
  ]
  expect(generateListBank(listBank)).toEqual([
    {
      bankCode: 'BCA',
      bankName: 'BANK BCA',
      chargeFee: 0,
      chargeFeePercent: 0,
      status: 1,
      active: false
    },
    {
      bankCode: 'MANDIRI',
      bankName: 'BANK MANDIRI',
      chargeFee: 0,
      chargeFeePercent: 0,
      status: 1,
      active: false
    }
  ])
})

it('When parameter not provided', () => {
  expect(generateListBank()).toEqual([])
})

it('When parameter provide with null', () => {
  expect(generateListBank(null, null)).toEqual([])
})

it('Test checkBankActive with undefined data', () => {
  expect(checkBankActive(undefined, undefined)).toEqual(false)
})

it('Test checkBankActive with null data', () => {
  expect(checkBankActive(null, null)).toEqual(false)
})

it('Test checkBankActive with null data only on cost', () => {
  expect(checkBankActive({}, null)).toEqual(false)
})

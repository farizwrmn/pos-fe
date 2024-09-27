import {
  reArrangeMember,
  reArrangeMemberId,
  insertCashierTrans,
  getSetting
} from '../variables'
import { getCashierTrans, setItem } from '../lstorage'

it('Return Object of Customer Umum with phoneNumber', () => {
  const data = {
    memberCode: 'UMUM',
    memberName: 'CUSTOMER UMUM',
    address01: 'JL Cempaka 2',
    cashback: 2000,
    id: 1,
    memberTypeName: 'CUSTOMER UMUM',
    memberTypeId: 1,
    memberSellPrice: 'sellPrice',
    showAsDiscount: 1,
    memberPendingPayment: 1,
    gender: 'M',
    mobileNumber: '',
    phoneNumber: '0617272721'
  }
  expect(reArrangeMember(data)).toEqual({
    memberCode: data.memberCode,
    memberName: data.memberName,
    address01: data.address01,
    cashback: data.cashback,
    id: data.id,
    memberTypeName: data.memberTypeName,
    memberTypeId: data.memberTypeId,
    memberSellPrice: data.memberSellPrice,
    showAsDiscount: data.showAsDiscount,
    memberPendingPayment: data.memberPendingPayment,
    gender: data.gender,
    phone: data.phoneNumber
  })
})

it('Return Object of Customer Umum with mobileNumber', () => {
  const data = {
    memberCode: 'UMUM',
    memberName: 'CUSTOMER UMUM',
    address01: 'JL Cempaka 2',
    cashback: 2000,
    id: 1,
    memberTypeName: 'CUSTOMER UMUM',
    memberTypeId: 1,
    memberSellPrice: 'sellPrice',
    showAsDiscount: 1,
    memberPendingPayment: 1,
    gender: 'M',
    mobileNumber: '0812981910291',
    phoneNumber: ''
  }
  expect(reArrangeMember(data)).toEqual({
    memberCode: data.memberCode,
    memberName: data.memberName,
    address01: data.address01,
    cashback: data.cashback,
    id: data.id,
    memberTypeName: data.memberTypeName,
    memberTypeId: data.memberTypeId,
    memberSellPrice: data.memberSellPrice,
    showAsDiscount: data.showAsDiscount,
    memberPendingPayment: data.memberPendingPayment,
    gender: data.gender,
    phone: data.mobileNumber
  })
})

it('Return Object of Customer Umum without cashback', () => {
  const data = {
    memberCode: 'UMUM',
    memberName: 'CUSTOMER UMUM',
    address01: 'JL Cempaka 2',
    id: 1,
    memberTypeName: 'CUSTOMER UMUM',
    memberTypeId: 1,
    memberSellPrice: 'sellPrice',
    showAsDiscount: 1,
    memberPendingPayment: 1,
    gender: 'M',
    mobileNumber: '0812981910291',
    phoneNumber: ''
  }
  expect(reArrangeMember(data)).toEqual({
    memberCode: data.memberCode,
    memberName: data.memberName,
    address01: data.address01,
    cashback: 0,
    id: data.id,
    memberTypeName: data.memberTypeName,
    memberTypeId: data.memberTypeId,
    memberSellPrice: data.memberSellPrice,
    showAsDiscount: data.showAsDiscount,
    memberPendingPayment: data.memberPendingPayment,
    gender: data.gender,
    phone: data.mobileNumber
  })
})

it('Return Object of Customer Umum by memberId with phoneNumber', () => {
  const data = {
    memberCode: 'UMUM',
    memberName: 'CUSTOMER UMUM',
    address01: 'JL Cempaka 2',
    cashback: 2000,
    memberId: 1,
    memberTypeName: 'CUSTOMER UMUM',
    memberTypeId: 1,
    memberSellPrice: 'sellPrice',
    showAsDiscount: 1,
    memberPendingPayment: 1,
    gender: 'M',
    mobileNumber: '',
    phoneNumber: '0617272721'
  }
  expect(reArrangeMemberId(data)).toEqual({
    memberCode: data.memberCode,
    memberName: data.memberName,
    address01: data.address01,
    cashback: data.cashback,
    id: data.memberId,
    memberTypeName: data.memberTypeName,
    memberTypeId: data.memberTypeId,
    memberSellPrice: data.memberSellPrice,
    showAsDiscount: data.showAsDiscount,
    memberPendingPayment: data.memberPendingPayment,
    gender: data.gender,
    phone: data.phoneNumber
  })
})

it('Return Object of Customer Umum by memberId with mobileNumber', () => {
  const data = {
    memberCode: 'UMUM',
    memberName: 'CUSTOMER UMUM',
    address01: 'JL Cempaka 2',
    cashback: 2000,
    memberId: 1,
    memberTypeName: 'CUSTOMER UMUM',
    memberTypeId: 1,
    memberSellPrice: 'sellPrice',
    showAsDiscount: 1,
    memberPendingPayment: 1,
    gender: 'M',
    mobileNumber: '0812981910291',
    phoneNumber: ''
  }
  expect(reArrangeMemberId(data)).toEqual({
    memberCode: data.memberCode,
    memberName: data.memberName,
    address01: data.address01,
    cashback: data.cashback,
    id: data.memberId,
    memberTypeName: data.memberTypeName,
    memberTypeId: data.memberTypeId,
    memberSellPrice: data.memberSellPrice,
    showAsDiscount: data.showAsDiscount,
    memberPendingPayment: data.memberPendingPayment,
    gender: data.gender,
    phone: data.mobileNumber
  })
})

it('Return Object of Customer Umum by memberId without cashback 1', () => {
  const data = {
    memberCode: 'UMUM',
    memberName: 'CUSTOMER UMUM',
    address01: 'JL Cempaka 2',
    memberId: 1,
    memberTypeName: 'CUSTOMER UMUM',
    memberTypeId: 1,
    memberSellPrice: 'sellPrice',
    showAsDiscount: 1,
    memberPendingPayment: 1,
    gender: 'M',
    mobileNumber: '0812981910291',
    phoneNumber: ''
  }
  expect(reArrangeMemberId(data)).toEqual({
    memberCode: data.memberCode,
    memberName: data.memberName,
    address01: data.address01,
    cashback: 0,
    id: data.memberId,
    memberTypeName: data.memberTypeName,
    memberTypeId: data.memberTypeId,
    showAsDiscount: data.showAsDiscount,
    memberSellPrice: data.memberSellPrice,
    memberPendingPayment: data.memberPendingPayment,
    gender: data.gender,
    phone: data.mobileNumber
  })
})

it('Return Object of Customer Umum by memberId without cashback 2', () => {
  const lastCashierTrans = getCashierTrans()
  const data = {
    no: 1,
    code: 'TEST1',
    productId: 1,
    name: 'PRODUCT TEST 1',
    employeeId: 1,
    employeeName: 'MECHANIC 1',
    typeCode: 'P',
    qty: 1,
    sellPrice: 25000,
    price: 20000,
    discount: 0,
    disc1: 0,
    disc2: 0,
    disc3: 0,
    total: 20000
  }
  expect(insertCashierTrans(data, lastCashierTrans)).toEqual([{
    no: data.no,
    bundleCode: data.bundleCode,
    bundleId: data.bundleId,
    bundleName: data.bundleName,
    distPrice01: data.distPrice01,
    distPrice02: data.distPrice02,
    distPrice03: data.distPrice03,
    distPrice04: data.distPrice04,
    distPrice05: data.distPrice05,
    distPrice06: data.distPrice06,
    distPrice07: data.distPrice07,
    distPrice08: data.distPrice08,
    distPrice09: data.distPrice09,
    categoryCode: data.categoryCode,
    hide: data.hide,
    inputTime: new Date().valueOf(),
    probBundleId: undefined,
    probBundleCode: undefined,
    probBundleName: undefined,
    probBundleTargetQty: undefined,
    probFinalPrice: undefined,
    newValue: data.newValue,
    oldValue: data.oldValue,
    replaceable: data.replaceable,
    retailPrice: data.retailPrice,
    employeeId: data.employeeId,
    employeeName: data.employeeName,
    productId: data.productId,
    code: data.code,
    name: data.name,
    qty: data.qty,
    typeCode: data.typeCode,
    sellPrice: data.sellPrice,
    price: data.price,
    discount: data.discount,
    disc1: data.disc1,
    disc2: data.disc2,
    disc3: data.disc3,
    total: data.total
  }])
})

it('Return Object of Setting Invoice', () => {
  const arrayProd = []
  arrayProd.Invoice = {
    showCashback: false,
    footer1: '* Harga sudah termasuk PPN 10%',
    footer2: null
  }
  setItem('setting', JSON.stringify(Object.assign({}, arrayProd)))
  expect(getSetting('Invoice')).toEqual(arrayProd.Invoice)
})

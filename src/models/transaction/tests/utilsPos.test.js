import { getListProductAfterBundling } from '../utilsPos'

describe('Test Bundling Product', () => {
  it('Should return Rp25.000', () => {
    const listProduct = [
      {
        productId: 1,
        name: 'Product 1',
        probBundleId: 1,
        probBundleCode: '000001',
        probBundleName: 'Buy 3 Rp 25000',
        probBundleTargetQty: 3,
        probFinalPrice: 25000,
        probBundle: {
          alwaysOn: 1,
          applyMultiple: 1,
          availableDate: null,
          buildComponent: null,
          id: 1,
          code: '000001',
          endDate: '2024-08-31',
          endHour: '23:59:00',
          minimumPayment: null,
          name: 'Buy 3 Rp 25000',
          paymentBankId: null,
          paymentOption: null,
          startDate: '2024-08-02',
          startHour: '00:00:00',
          targetCostPrice: 3,
          targetRetailPrice: 25000,
          type: 2
        },
        qty: 3,
        sellPrice: 9000,
        price: 9000,
        discount: 0,
        disc1: 0,
        disc2: 0,
        disc3: 0,
        total: 27000
      }
    ]
    const { cashier, bundle } = getListProductAfterBundling(listProduct)
    expect(cashier.reduce((prev, next) => prev + next.total, 0)).toBe(25000)
    expect(cashier.reduce((prev, next) => prev + next.qty, 0)).toBe(3)
    expect(bundle.reduce((prev, next) => prev + next.qty, 0)).toBe(1)
  })

  it('Should return Rp25.000', () => {
    const listProduct = [
      {
        productId: 1,
        name: 'Product 1',
        probBundleId: 1,
        probBundleCode: '000001',
        probBundleName: 'Buy 3 Rp 25000',
        probBundleTargetQty: 3,
        probFinalPrice: 25000,
        probBundle: {
          alwaysOn: 1,
          applyMultiple: 1,
          availableDate: null,
          buildComponent: null,
          id: 1,
          code: '000001',
          endDate: '2024-08-31',
          endHour: '23:59:00',
          minimumPayment: null,
          name: 'Buy 3 Rp 25000',
          paymentBankId: null,
          paymentOption: null,
          startDate: '2024-08-02',
          startHour: '00:00:00',
          targetCostPrice: 3,
          targetRetailPrice: 25000,
          type: 2
        },
        qty: 2,
        sellPrice: 9000,
        price: 9000,
        discount: 0,
        disc1: 0,
        disc2: 0,
        disc3: 0,
        total: 18000
      },
      {
        productId: 2,
        name: 'Product 2',
        probBundleId: 1,
        probBundleCode: '000001',
        probBundleName: 'Buy 3 Rp 25000',
        probBundleTargetQty: 3,
        probFinalPrice: 25000,
        probBundle: {
          alwaysOn: 1,
          applyMultiple: 1,
          availableDate: null,
          buildComponent: null,
          id: 1,
          code: '000001',
          endDate: '2024-08-31',
          endHour: '23:59:00',
          minimumPayment: null,
          name: 'Buy 3 Rp 25000',
          paymentBankId: null,
          paymentOption: null,
          startDate: '2024-08-02',
          startHour: '00:00:00',
          targetCostPrice: 3,
          targetRetailPrice: 25000,
          type: 2
        },
        qty: 2,
        sellPrice: 9000,
        price: 9000,
        discount: 0,
        disc1: 0,
        disc2: 0,
        disc3: 0,
        total: 18000
      }
    ]
    const { cashier, bundle } = getListProductAfterBundling(listProduct)
    expect(cashier.reduce((prev, next) => prev + next.total, 0)).toBe(34000)
    expect(cashier.reduce((prev, next) => prev + next.qty, 0)).toBe(4)
    expect(bundle.reduce((prev, next) => prev + next.qty, 0)).toBe(1)
  })

  it('Should return Rp25.000', () => {
    const listProduct = [
      {
        productId: 1,
        name: 'Product 1',
        probBundleId: 1,
        probBundleCode: '000001',
        probBundleName: 'Buy 3 Rp 25000',
        probBundleTargetQty: 3,
        probFinalPrice: 25000,
        probBundle: {
          alwaysOn: 1,
          applyMultiple: 1,
          availableDate: null,
          buildComponent: null,
          id: 1,
          code: '000001',
          endDate: '2024-08-31',
          endHour: '23:59:00',
          minimumPayment: null,
          name: 'Buy 3 Rp 25000',
          paymentBankId: null,
          paymentOption: null,
          startDate: '2024-08-02',
          startHour: '00:00:00',
          targetCostPrice: 3,
          targetRetailPrice: 25000,
          type: 2
        },
        qty: 4,
        sellPrice: 9000,
        price: 9000,
        discount: 0,
        disc1: 0,
        disc2: 0,
        disc3: 0,
        total: 36000
      },
      {
        productId: 2,
        name: 'Product 2',
        probBundleId: 1,
        probBundleCode: '000001',
        probBundleName: 'Buy 3 Rp 25000',
        probBundleTargetQty: 3,
        probFinalPrice: 25000,
        probBundle: {
          alwaysOn: 1,
          applyMultiple: 1,
          availableDate: null,
          buildComponent: null,
          id: 1,
          code: '000001',
          endDate: '2024-08-31',
          endHour: '23:59:00',
          minimumPayment: null,
          name: 'Buy 3 Rp 25000',
          paymentBankId: null,
          paymentOption: null,
          startDate: '2024-08-02',
          startHour: '00:00:00',
          targetCostPrice: 3,
          targetRetailPrice: 25000,
          type: 2
        },
        qty: 4,
        sellPrice: 9000,
        price: 9000,
        discount: 0,
        disc1: 0,
        disc2: 0,
        disc3: 0,
        total: 36000
      }
    ]
    const { cashier, bundle } = getListProductAfterBundling(listProduct)
    expect(cashier.reduce((prev, next) => prev + next.total, 0)).toBe(68000)
    expect(cashier.reduce((prev, next) => prev + next.qty, 0)).toBe(8)
    expect(bundle.reduce((prev, next) => prev + next.qty, 0)).toBe(2)
  })
})


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
          applyMultiple: '1',
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
          applyMultiple: '1',
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
          applyMultiple: '1',
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
          applyMultiple: '1',
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
          applyMultiple: '1',
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

  it('Should return 87.000 testing apply multiple 0 on first qty 6', () => {
    const listProduct = [
      {
        productId: 1,
        name: 'Product 1',
        probBundleId: 1,
        probBundleCode: '000001',
        probBundleName: 'Buy 2 Rp 15000',
        probBundleTargetQty: 2,
        probFinalPrice: 15000,
        probBundle: {
          alwaysOn: 1,
          applyMultiple: '0',
          availableDate: null,
          buildComponent: null,
          id: 1,
          code: '000001',
          endDate: '2024-08-31',
          endHour: '23:59:00',
          minimumPayment: null,
          name: 'Buy 2 Rp 15000',
          paymentBankId: null,
          paymentOption: null,
          startDate: '2024-08-02',
          startHour: '00:00:00',
          targetCostPrice: 3,
          targetRetailPrice: 15000,
          type: 2
        },
        qty: 6,
        sellPrice: 9000,
        price: 9000,
        discount: 0,
        disc1: 0,
        disc2: 0,
        disc3: 0,
        total: 54000
      },
      {
        productId: 2,
        name: 'Product 2',
        probBundleId: 1,
        probBundleCode: '000001',
        probBundleName: 'Buy 2 Rp 15000',
        probBundleTargetQty: 2,
        probFinalPrice: 15000,
        probBundle: {
          alwaysOn: 1,
          applyMultiple: '0',
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
          targetRetailPrice: 15000,
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
    expect(cashier.reduce((prev, next) => prev + next.qty, 0)).toBe(10)
    expect(cashier.reduce((prev, next) => prev + next.total, 0)).toBe(87000)
    expect(bundle.reduce((prev, next) => prev + next.qty, 0)).toBe(1)
  })

  it('Should return 87.000 testing apply multiple 0 on first qty 1', () => {
    const listProduct = [
      {
        productId: 1,
        name: 'Product 1',
        probBundleId: 1,
        probBundleCode: '000001',
        probBundleName: 'Buy 2 Rp 15000',
        probBundleTargetQty: 2,
        probFinalPrice: 15000,
        probBundle: {
          alwaysOn: 1,
          applyMultiple: '0',
          availableDate: null,
          buildComponent: null,
          id: 1,
          code: '000001',
          endDate: '2024-08-31',
          endHour: '23:59:00',
          minimumPayment: null,
          name: 'Buy 2 Rp 15000',
          paymentBankId: null,
          paymentOption: null,
          startDate: '2024-08-02',
          startHour: '00:00:00',
          targetCostPrice: 3,
          targetRetailPrice: 15000,
          type: 2
        },
        qty: 1,
        sellPrice: 9000,
        price: 9000,
        discount: 0,
        disc1: 0,
        disc2: 0,
        disc3: 0,
        total: 9000
      },
      {
        productId: 2,
        name: 'Product 2',
        probBundleId: 1,
        probBundleCode: '000001',
        probBundleName: 'Buy 2 Rp 15000',
        probBundleTargetQty: 2,
        probFinalPrice: 15000,
        probBundle: {
          alwaysOn: 1,
          applyMultiple: '0',
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
          targetRetailPrice: 15000,
          type: 2
        },
        qty: 9,
        sellPrice: 9000,
        price: 9000,
        discount: 0,
        disc1: 0,
        disc2: 0,
        disc3: 0,
        total: 81000
      }
    ]
    const { cashier, bundle } = getListProductAfterBundling(listProduct)
    const total = cashier.reduce((prev, next) => prev + next.total, 0)
    expect(cashier.reduce((prev, next) => prev + next.qty, 0)).toBe(10)
    expect(total).toBe(87000)
    expect(bundle.reduce((prev, next) => prev + next.qty, 0)).toBe(1)
  })

  it('Should return 87.000 testing apply multiple 0 on first qty 1', () => {
    const listProduct = [
      {
        productId: 1,
        name: 'Product 1',
        probBundleId: 1,
        probBundleCode: '000001',
        probBundleName: 'Buy 2 Rp 15000',
        probBundleTargetQty: 2,
        probFinalPrice: 15000,
        probBundle: {
          alwaysOn: 1,
          applyMultiple: '0',
          availableDate: null,
          buildComponent: null,
          id: 1,
          code: '000001',
          endDate: '2024-08-31',
          endHour: '23:59:00',
          minimumPayment: null,
          name: 'Buy 2 Rp 15000',
          paymentBankId: null,
          paymentOption: null,
          startDate: '2024-08-02',
          startHour: '00:00:00',
          targetCostPrice: 3,
          targetRetailPrice: 15000,
          type: 2
        },
        qty: 1,
        sellPrice: 9000,
        price: 9000,
        discount: 0,
        disc1: 0,
        disc2: 0,
        disc3: 0,
        total: 9000
      },
      {
        productId: 2,
        name: 'Product 2',
        probBundleId: 1,
        probBundleCode: '000001',
        probBundleName: 'Buy 2 Rp 15000',
        probBundleTargetQty: 2,
        probFinalPrice: 15000,
        probBundle: {
          alwaysOn: 1,
          applyMultiple: '0',
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
          targetRetailPrice: 15000,
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
    const total = cashier.reduce((prev, next) => prev + next.total, 0)
    expect(cashier.reduce((prev, next) => prev + next.qty, 0)).toBe(3)
    expect(total).toBe(24000)
    expect(bundle.reduce((prev, next) => prev + next.qty, 0)).toBe(1)
  })

  it('Should return 87.000 testing apply multiple 0 on first qty 1', () => {
    const listProduct = [
      {
        productId: 1,
        name: 'Product 1',
        probBundleId: 1,
        probBundleCode: '000001',
        probBundleName: 'Buy 2 Rp 15000',
        probBundleTargetQty: 2,
        probFinalPrice: 15000,
        probBundle: {
          alwaysOn: 1,
          applyMultiple: '0',
          availableDate: null,
          buildComponent: null,
          id: 1,
          code: '000001',
          endDate: '2024-08-31',
          endHour: '23:59:00',
          minimumPayment: null,
          name: 'Buy 2 Rp 15000',
          paymentBankId: null,
          paymentOption: null,
          startDate: '2024-08-02',
          startHour: '00:00:00',
          targetCostPrice: 3,
          targetRetailPrice: 15000,
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
    const total = cashier.reduce((prev, next) => prev + next.total, 0)
    expect(cashier.reduce((prev, next) => prev + next.qty, 0)).toBe(3)
    expect(total).toBe(24000)
    expect(bundle.reduce((prev, next) => prev + next.qty, 0)).toBe(1)
  })

  it('Should return Test Multiple Item', () => {
    const listProduct = [
      {
        productId: 1,
        name: 'Product 1',
        probBundleId: undefined,
        probBundleCode: undefined,
        probBundleName: undefined,
        probBundleTargetQty: undefined,
        probFinalPrice: undefined,
        probBundle: undefined,
        qty: 2,
        sellPrice: 7500,
        price: 7500,
        discount: 0,
        disc1: 0,
        disc2: 0,
        disc3: 0,
        total: 15000,
        transLog: 2,
        no: 1,
        bundleId: 1,
        bundleCode: '000001',
        bundleName: 'Buy 2 Rp 15000',
        retailPrice: 7500,
        distPrice01: 7500,
        distPrice02: 7500,
        distPrice03: 7500,
        distPrice04: 7500,
        distPrice05: 7500,
        distPrice06: 7500,
        distPrice07: 7500,
        distPrice08: 7500,
        distPrice09: 7500,
        sellingPrice: 7500
      },
      {
        productId: 1,
        name: 'Product 1',
        probBundleId: undefined,
        probBundleCode: undefined,
        probBundleName: undefined,
        probBundleTargetQty: undefined,
        probFinalPrice: undefined,
        probBundle: undefined,
        qty: 2,
        sellPrice: 9000,
        price: 9000,
        discount: 0,
        disc1: 0,
        disc2: 0,
        disc3: 0,
        total: 18000,
        transLog: 4,
        no: 2
      }
    ]
    const listBundle = [
      {
        alwaysOn: 1,
        applyMultiple: '0',
        availableDate: null,
        buildComponent: null,
        bundleId: 1,
        code: '000001',
        endDate: '2024-08-31',
        endHour: '23:59:00',
        haveTargetPrice: false,
        inputTime: 1735623899819,
        minimumPayment: null,
        name: 'Buy 2 Rp 15000',
        no: 1,
        paymentBankId: null,
        paymentOption: null,
        qty: 1,
        rewardCategory: [],
        startDate: '2024-08-02',
        startHour: '00:00:00',
        targetCostPrice: 3,
        targetRetailPrice: 15000,
        type: 2
      }
    ]
    const { cashier, bundle } = getListProductAfterBundling(listProduct, listBundle)
    const total = cashier.reduce((prev, next) => prev + next.total, 0)
    expect(cashier.reduce((prev, next) => prev + next.qty, 0)).toBe(4)
    expect(total).toBe(33000)
    expect(bundle.reduce((prev, next) => prev + next.qty, 0)).toBe(1)
  })

  it('Should return Test Multiple Item', () => {
    const listProduct = [
      {
        no: 1,
        employeeId: 1,
        employeeName: 'Veirry (ownerPOS)',
        productId: 16902,
        code: '880468',
        name: 'K3 ONIGIRI SPICY TUNA',
        qty: 2,
        typeCode: 'P',
        sellPrice: 7500,
        inputTime: 1735624152448,
        retailPrice: 7500,
        distPrice01: 7500,
        distPrice02: 7500,
        distPrice03: 7500,
        distPrice04: 7500,
        distPrice05: 7500,
        distPrice06: 7500,
        distPrice07: 7500,
        distPrice08: 7500,
        distPrice09: 7500,
        price: 7500,
        discount: 0,
        disc1: 0,
        disc2: 0,
        disc3: 0,
        total: 15000,
        transLog: 2,
        sellingPrice: 7500,
        bundleId: 25173,
        bundleCode: 'KKKPRM2024004407',
        bundleName: 'PROMO ONIGIRI'
      },
      {
        no: 2,
        employeeId: 1,
        employeeName: 'Veirry (ownerPOS)',
        productId: 16902,
        code: '880468',
        name: 'K3 ONIGIRI SPICY TUNA',
        probBundleId: 25173,
        probBundleCode: 'KKKPRM2024004407',
        probBundleName: 'PROMO ONIGIRI',
        probBundleTargetQty: 2,
        probFinalPrice: 15000,
        probBundle: {
          id: 25173,
          type: '2',
          code: 'KKKPRM2024004407',
          name: 'PROMO ONIGIRI',
          barcode01: 'KKKPRM2024004407',
          alwaysOn: true,
          minimumPayment: 0,
          paymentOption: null,
          paymentBankId: null,
          buildComponent: false,
          haveTargetPrice: false,
          targetRetailPrice: 15000,
          targetCostPrice: 2,
          startDate: '2024-12-31',
          endDate: '2024-12-31',
          startHour: '00:00:00',
          endHour: '23:59:00',
          availableDate: null,
          availableStore: null,
          applyMultiple: '0',
          status: '1',
          weight: null,
          bundlingCategoryId: 6,
          activeShop: false,
          grabCategoryId: null,
          categoryId: null,
          subcategoryId: null,
          grabCategoryName: null,
          description: null,
          isPosHighlight: 0,
          createdBy: 'ownerPOS',
          createdAt: '2024-12-31T02:20:05.000Z',
          updatedBy: '---',
          updatedAt: '2024-12-31T02:20:05.000Z'
        },
        qty: 2,
        typeCode: 'P',
        sellPrice: 14900,
        inputTime: 1735624166705,
        retailPrice: 14900,
        distPrice01: 14155,
        distPrice02: 18625,
        distPrice03: 18625,
        distPrice04: 18625,
        distPrice05: 15943,
        distPrice06: 14155,
        distPrice07: 14900,
        distPrice08: 25330,
        distPrice09: 14155,
        price: 14900,
        discount: 0,
        disc1: 0,
        disc2: 0,
        disc3: 0,
        total: 29800,
        transLog: 7,
        sellingPrice: 14900
      }
    ]
    const listBundle = [
      {
        alwaysOn: true,
        applyMultiple: '0',
        availableDate: null,
        buildComponent: false,
        bundleId: 25173,
        code: 'KKKPRM2024004407',
        endDate: '2024-12-31',
        endHour: '23:59:00',
        haveTargetPrice: false,
        inputTime: 1735624152488,
        minimumPayment: 0,
        name: 'PROMO ONIGIRI',
        no: 1,
        paymentBankId: null,
        paymentOption: null,
        qty: 1,
        rewardCategory: [],
        startDate: '2024-12-31',
        startHour: '00:00:00',
        targetCostPrice: 2,
        targetRetailPrice: 15000,
        type: '2'
      }
    ]
    const { cashier, bundle } = getListProductAfterBundling(listProduct, listBundle)
    const total = cashier.reduce((prev, next) => prev + next.total, 0)
    expect(cashier.reduce((prev, next) => prev + next.qty, 0)).toBe(4)
    expect(total).toBe(44800)
    expect(bundle.reduce((prev, next) => prev + next.qty, 0)).toBe(1)
  })

  it('Should return Test Multiple Item', () => {
    const listProduct = [
      {
        no: 1,
        employeeId: 1,
        employeeName: 'Veirry (ownerPOS)',
        productId: 16903,
        code: '880461',
        name: 'K3 ONIGIRI AYAM GEPREK',
        qty: 2,
        typeCode: 'P',
        sellPrice: 7500,
        inputTime: 1735627302701,
        retailPrice: 7500,
        distPrice01: 7500,
        distPrice02: 7500,
        distPrice03: 7500,
        distPrice04: 7500,
        distPrice05: 7500,
        distPrice06: 7500,
        distPrice07: 7500,
        distPrice08: 7500,
        distPrice09: 7500,
        price: 7500,
        discount: 0,
        disc1: 0,
        disc2: 0,
        disc3: 0,
        total: 15000,
        transFind: 3,
        transLog: 2,
        sellingPrice: 7500,
        bundleId: 25173,
        bundleCode: 'KKKPRM2024004407',
        bundleName: 'PROMO ONIGIRI'
      },
      {
        no: 2,
        employeeId: 1,
        employeeName: 'Veirry (ownerPOS)',
        productId: 16902,
        code: '880468',
        name: 'K3 ONIGIRI SPICY TUNA',
        probBundleId: 25173,
        probBundleCode: 'KKKPRM2024004407',
        probBundleName: 'PROMO ONIGIRI',
        probBundleTargetQty: 2,
        probFinalPrice: 15000,
        probBundle: {
          id: 25173,
          type: '2',
          code: 'KKKPRM2024004407',
          name: 'PROMO ONIGIRI',
          barcode01: 'KKKPRM2024004407',
          alwaysOn: true,
          minimumPayment: 0,
          paymentOption: null,
          paymentBankId: null,
          buildComponent: false,
          haveTargetPrice: false,
          targetRetailPrice: 15000,
          targetCostPrice: 2,
          startDate: '2024-12-31',
          endDate: '2024-12-31',
          startHour: '00:00:00',
          endHour: '23:59:00',
          availableDate: null,
          availableStore: null,
          applyMultiple: '0',
          status: '1',
          weight: null,
          bundlingCategoryId: 6,
          activeShop: false,
          grabCategoryId: null,
          categoryId: null,
          subcategoryId: null,
          grabCategoryName: null,
          description: null,
          isPosHighlight: 0,
          createdBy: 'ownerPOS',
          createdAt: '2024-12-31T02:20:05.000Z',
          updatedBy: '---',
          updatedAt: '2024-12-31T02:20:05.000Z'
        },
        qty: 1,
        typeCode: 'P',
        sellPrice: 14900,
        inputTime: 1735627306194,
        retailPrice: 14900,
        distPrice01: 14155,
        distPrice02: 18625,
        distPrice03: 18625,
        distPrice04: 18625,
        distPrice05: 15943,
        distPrice06: 14155,
        distPrice07: 14900,
        distPrice08: 25330,
        distPrice09: 14155,
        price: 14900,
        discount: 0,
        disc1: 0,
        disc2: 0,
        disc3: 0,
        total: 14900,
        transFind: 3,
        transLog: 7
      },
      {
        no: 3,
        employeeId: 1,
        employeeName: 'Veirry (ownerPOS)',
        productId: 16903,
        code: '880461',
        name: 'K3 ONIGIRI AYAM GEPREK',
        probBundleId: 25173,
        probBundleCode: 'KKKPRM2024004407',
        probBundleName: 'PROMO ONIGIRI',
        probBundleTargetQty: 2,
        probFinalPrice: 15000,
        probBundle: {
          id: 25173,
          type: '2',
          code: 'KKKPRM2024004407',
          name: 'PROMO ONIGIRI',
          barcode01: 'KKKPRM2024004407',
          alwaysOn: true,
          minimumPayment: 0,
          paymentOption: null,
          paymentBankId: null,
          buildComponent: false,
          haveTargetPrice: false,
          targetRetailPrice: 15000,
          targetCostPrice: 2,
          startDate: '2024-12-31',
          endDate: '2024-12-31',
          startHour: '00:00:00',
          endHour: '23:59:00',
          availableDate: null,
          availableStore: null,
          applyMultiple: '0',
          status: '1',
          weight: null,
          bundlingCategoryId: 6,
          activeShop: false,
          grabCategoryId: null,
          categoryId: null,
          subcategoryId: null,
          grabCategoryName: null,
          description: null,
          isPosHighlight: 0,
          createdBy: 'ownerPOS',
          createdAt: '2024-12-31T02:20:05.000Z',
          updatedBy: '---',
          updatedAt: '2024-12-31T02:20:05.000Z'
        },
        qty: 1,
        typeCode: 'P',
        sellPrice: 14900,
        inputTime: 1735627326844,
        retailPrice: 14900,
        distPrice01: 14155,
        distPrice02: 18625,
        distPrice03: 18625,
        distPrice04: 18625,
        distPrice05: 15943,
        distPrice06: 14155,
        distPrice07: 14900,
        distPrice08: 25330,
        distPrice09: 14155,
        price: 14900,
        discount: 0,
        disc1: 0,
        disc2: 0,
        disc3: 0,
        total: 14900
      }
    ]

    const listBundle = [
      {
        alwaysOn: true,
        applyMultiple: '0',
        availableDate: null,
        buildComponent: false,
        bundleId: 25173,
        code: 'KKKPRM2024004407',
        endDate: '2024-12-31',
        endHour: '23:59:00',
        haveTargetPrice: false,
        inputTime: 1735627302728,
        minimumPayment: 0,
        name: 'PROMO ONIGIRI',
        no: 1,
        paymentBankId: null,
        paymentOption: null,
        qty: 1,
        rewardCategory: [],
        startDate: '2024-12-31',
        startHour: '00:00:00',
        targetCostPrice: 2,
        targetRetailPrice: 15000,
        type: '2'
      }
    ]
    const { cashier, bundle } = getListProductAfterBundling(listProduct, listBundle, 'Test Last')
    console.log('cashier', cashier)
    const total = cashier.reduce((prev, next) => prev + next.total, 0)
    expect(cashier.reduce((prev, next) => prev + next.qty, 0)).toBe(4)
    expect(total).toBe(44800)
    expect(bundle.reduce((prev, next) => prev + next.qty, 0)).toBe(1)
  })
})


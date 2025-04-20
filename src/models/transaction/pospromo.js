import modelExtend from 'dva-model-extend'
import { message, Modal } from 'antd'
import { posTotal, numberFormat } from 'utils'
import {
  getCurrentUserStore,
  getCashierTrans, getServiceTrans, getConsignment, getBundleTrans,
  // getGrabmartOrder,
  setCashierTrans, setServiceTrans, setBundleTrans
} from 'utils/lstorage'
import {
  insertBundleTrans
} from 'utils/variables'
import reduce from 'lodash/reduce'
import { query } from '../../services/marketing/bundling'
import { queryAllocation, queryMember } from '../../services/marketing/bundlingAllocation'
import { query as queryReward } from '../../services/marketing/bundlingReward'
import { pageModel } from './../common'
// import { getDiscountByBundleCode } from './utils'

const numberFormatter = numberFormat.numberFormatter

const group = (data, key) => {
  return reduce(data, (group, item) => {
    (group[`${item[key]}`] = group[`${item[key]}`] || []).push(item)
    return group
  }, [])
}

const groupProduct = (list, dataBundle = []) => {
  const listGroup = group(list.filter(filtered => filtered.bundleId), 'bundleCode')
  let newList = []
  for (let key in listGroup) {
    if (key === 'remove') {
      // eslint-disable-next-line no-continue
      continue
    }
    const price = listGroup[key].reduce((prev, next) => prev + next.total, 0)
    // eslint-disable-next-line no-loop-func
    const filteredBundle = dataBundle && dataBundle[0] ? dataBundle.filter(filtered => parseFloat(filtered.bundleId) === parseFloat(listGroup[key][0].bundleId)) : []
    newList.push({
      key,
      code: filteredBundle && filteredBundle[0] ? filteredBundle[0].code : key,
      name: filteredBundle && filteredBundle[0] ? filteredBundle[0].name : key,
      detail: listGroup[key],
      price,
      sellPrice: price,
      type: 'Bundle',
      qty: filteredBundle && filteredBundle[0] ? filteredBundle[0].qty : 1,
      total: price
    })
  }
  return newList
}

export default modelExtend(pageModel, {
  namespace: 'pospromo',

  state: {
    currentItem: {},
    modalType: 'add',
    activeKey: '0',
    searchText: null,
    typeModal: null,
    modalPromoVisible: false,

    // Start - Category Promo List
    currentReward: {},
    bundleData: {},
    listCategory: [],
    productData: {},
    serviceData: {},
    // End - Category Promo List

    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    }
  },

  subscriptions: {
    // setup ({ dispatch, history }) {
    //   history.listen((location) => {
    //     const { pathname } = location
    //     if (pathname === '/transaction/pos') {
    //       dispatch({ type: 'query', payload: { storeId: lstorage.getCurrentUserStore() } })
    //     }
    //   })
    // }
  },

  effects: {
    * addPosPromoItem ({ payload = {} }, { put }) {
      const { bundleData, currentProduct, itemRewardProduct, currentService, itemRewardService, itemRewardCategory } = payload

      const { qty } = bundleData
      if (itemRewardCategory.length === 0) {
        yield put({
          type: 'setProductPos',
          payload: {
            qty,
            currentProduct,
            currentReward: itemRewardProduct
          }
        })
        yield put({
          type: 'setServicePos',
          payload: {
            qty,
            currentProduct: currentService,
            currentReward: itemRewardService
          }
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            productData: {
              qty,
              currentProduct,
              currentReward: itemRewardProduct
            },
            serviceData: {
              qty,
              currentProduct: currentService,
              currentReward: itemRewardService
            }
          }
        })
      }
      yield put({
        type: 'setCategoryPos',
        payload: {
          qty,
          currentReward: itemRewardCategory,
          bundleData
        }
      })
    },


    * addPosPromo ({ payload = {} }, { call, select, put }) {
      const memberInformation = yield select(({ pos }) => pos.memberInformation)
      const currentBuildComponent = yield select(({ pos }) => pos.currentBuildComponent)
      const dineInTax = yield select(({ pos }) => pos.dineInTax)
      // * POS Total
      const currentProduct = yield getCashierTrans()
      const currentConsignment = yield getConsignment()
      const currentService = yield getServiceTrans()
      const currentBundle = yield getBundleTrans()

      const groupDataBundle = groupProduct(currentProduct.filter(filtered => filtered.bundleId), currentBundle)
      const groupDataPos = currentProduct.filter(filtered => !filtered.bundleId).concat(groupDataBundle).concat(currentService).concat(currentConsignment)
      let totalDiscount = memberInformation.useLoyalty || 0
      let totalPayment = groupDataPos.reduce((cnt, o) => cnt + o.total, 0)

      const curNetto = (parseFloat(totalPayment) - parseFloat(totalDiscount)) || 0
      const dineIn = curNetto * (dineInTax / 100)

      if (currentBuildComponent && currentBuildComponent.no) {
        message.error('Only allow 1 bundle for custom')
        return
      }

      if (!memberInformation || JSON.stringify(memberInformation) === '{}') {
        const modal = Modal.warning({
          title: 'Warning',
          content: 'Member Not Found...!'
        })
        setTimeout(() => modal.destroy(), 1000)
        return
      }

      const { bundleId, qty = 1 } = payload

      const dataHeaderBundle = yield call(query, { id: bundleId })
      const dataDetailReward = yield call(queryReward, { bundleId, type: 'all' })

      if (dataHeaderBundle.success && dataDetailReward.success && dataDetailReward.data && dataDetailReward.data.length > 0) {
        const item = dataHeaderBundle.data[0]
        if (item && item.memberOnly) {
          if (memberInformation && memberInformation.memberCode === 'UMUM') {
            Modal.warning({
              title: 'Wajib input member',
              content: 'Promo ini membutuhkan input member'
            })
            return
          }
        }
        if (item && item.memberOnlyApplyMultiple === 0) {
          const response = yield call(queryMember, { memberId: memberInformation.id, bundlingId: item.id })
          if (response && response.success && response.data) {
            Modal.warning({
              title: 'Member ini sudah claim Promo ini',
              content: 'Tawarkan promo lainnya'
            })
            return
          }
        }
        if (item && item.hasStoreAllocation === 1) {
          const response = yield call(queryAllocation, { bundlingId: item.id, storeId: getCurrentUserStore() })
          if (response && response.data) {
            if (response.data.posQty >= response.data.qty) {
              Modal.warning({
                title: 'Promo ini sudah habis',
                content: 'Tawarkan promo lainnya'
              })
              return
            }
          }
        }
        const total = (parseFloat(curNetto) + parseFloat(dineIn))
        if (item && item.minimumPayment > 0 && item.minimumPayment > total) {
          Modal.error({
            title: `Payment must ${numberFormatter(item.minimumPayment)} or more`,
            content: 'Please add more Item to purchase'
          })
          return
        }
        const itemRewardProduct = dataDetailReward.data.filter(x => x.type === 'P' && x.categoryCode === null)
        const itemRewardService = dataDetailReward.data.filter(x => x.type !== 'P' && x.categoryCode === null)
        const itemRewardCategory = dataDetailReward.data.filter(x => x.categoryCode !== null)
        const resultCompareBundle = currentBundle.filter(filtered => filtered.bundleId === item.id)

        // eslint-disable-next-line eqeqeq
        if (resultCompareBundle && resultCompareBundle[0] && item.applyMultiple == 0) {
          Modal.warning({
            title: 'Cannot Apply Multiple to this promo',
            content: 'Call your stock administrator for this issue'
          })
          return
        }
        const categoryExists = itemRewardCategory ? itemRewardCategory[0] : undefined

        if (!categoryExists) {
          yield insertBundleTrans({ qty, item })
          yield put({ type: 'pos/setCurrentBuildComponent' })
        } else {
          yield put({
            type: 'updateState',
            payload: {
              currentReward: categoryExists
            }
          })
        }
        currentBundle.rewardCategory = itemRewardCategory
        item.rewardCategory = itemRewardCategory
        yield put({
          type: 'addPosPromoItem',
          payload: {
            bundleData: {
              qty,
              currentBundle,
              item
            },
            currentProduct: getCashierTrans(),
            itemRewardProduct,
            currentService: getServiceTrans(),
            itemRewardService,
            itemRewardCategory
          }
        })
        message.success('Success add bundle')
      } else if (dataHeaderBundle.success && dataHeaderBundle.data[0]) {
        const item = dataHeaderBundle.data[0]
        const product = getCashierTrans()
        const service = getServiceTrans()
        const consignment = getConsignment()
        const bundle = getBundleTrans()
        if (product.length > 0 || service.length > 0 || consignment.length > 0 || bundle.length > 0) {
          Modal.error({
            title: 'Failed to add bundle',
            content: 'Already Have other item in list'
          })
          return
        }
        if (item && item.buildComponent) {
          yield put({
            type: 'setBundleNeverExists',
            payload: {
              currentBundle,
              item
            }
          })
        }
      } else {
        if (dataDetailReward.data && dataDetailReward.data.length === 0) {
          Modal.error({
            title: 'Data Not Found',
            content: 'Reward and Rules Not Found'
          })
        }
        throw dataHeaderBundle
      }
    },
    * setBundleAlreadyExists ({ payload = {} }, { put }) {
      const currentBundle = payload.currentBundle
      payload.item.inputTime = new Date().valueOf()
      const item = payload.item
      const filteredBundle = currentBundle.filter(filtered => filtered.bundleId === item.id)
      let arrayProd = currentBundle
      if (filteredBundle && filteredBundle[0]) {
        arrayProd = currentBundle.map((data) => {
          if (data.no === filteredBundle[0].no) {
            return ({
              ...data,
              qty: parseFloat(data.qty) + 1
            })
          }
          return data
        })
      }

      setBundleTrans(JSON.stringify(arrayProd))
      yield put({ type: 'pos/setCurrentBuildComponent' })
      yield put({
        type: 'updateState',
        payload: {}
      })
    },
    * setBundleNeverExists ({ payload = {} }, { put }) {
      const currentBundle = payload.currentBundle
      const item = payload.item
      currentBundle.push({
        no: (currentBundle || []).length + 1,
        rewardCategory: payload.item.rewardCategory || [],
        applyMultiple: item.applyMultiple,
        bundleId: item.id,
        categoryCode: item.categoryCode,
        type: item.type,
        code: item.code,
        name: item.name,
        inputTime: new Date().valueOf(),
        minimumPayment: item.minimumPayment,
        memberOnly: item.memberOnly,
        memberOnlyApplyMultiple: item.memberOnlyApplyMultiple,
        hasStoreAllocation: item.hasStoreAllocation,
        paymentOption: item.paymentOption,
        paymentBankId: item.paymentBankId,
        alwaysOn: item.alwaysOn,
        haveTargetPrice: item.haveTargetPrice,
        targetRetailPrice: item.targetRetailPrice,
        targetCostPrice: item.targetCostPrice,
        startDate: item.startDate,
        endDate: item.endDate,
        startHour: item.startHour,
        endHour: item.endHour,
        buildComponent: item.buildComponent,
        availableDate: item.availableDate,
        qty: 1
      })
      yield put({ type: 'pos/setCurrentBuildComponent' })
      setBundleTrans(JSON.stringify(currentBundle))
      yield put({
        type: 'updateState',
        payload: {}
      })
    },
    * setProductPos ({ payload = {} }, { select, put }) {
      const memberInformation = yield select(({ pos }) => pos.memberInformation)
      const selectedPaymentShortcut = yield select(({ pos }) => (pos ? pos.selectedPaymentShortcut : {}))
      const mechanicInformation = yield select(({ pos }) => pos.mechanicInformation)
      let currentProduct = payload.currentProduct
      let currentReward = payload.currentReward
      let { qty = 1 } = payload
      let arrayProd = currentProduct
      if (currentReward && currentReward[0]) {
        for (let key in currentReward) {
          const reward = currentReward[key]
          // eslint-disable-next-line no-loop-func
          // eslint-disable-next-line eqeqeq
          const filteredProduct = currentProduct.filter(x => Number(x.productId) === Number(reward.productId) && x.bundleId == reward.bundleId && x.categoryCode == reward.categoryCode)
          if (filteredProduct && filteredProduct[0]) {
            const selectedProduct = filteredProduct[0]
            let sellingPrice = (memberInformation.memberSellPrice ? reward[memberInformation.memberSellPrice.toString()] : reward.sellPrice)
            if (selectedPaymentShortcut
              && selectedPaymentShortcut.sellPrice
              // eslint-disable-next-line eqeqeq
              && selectedPaymentShortcut.memberId == 0) {
              sellingPrice = reward[selectedPaymentShortcut.sellPrice] ? reward[selectedPaymentShortcut.sellPrice] : reward.sellPrice
            }
            let data = {
              no: selectedProduct.no,
              code: reward.productCode,
              productId: reward.productId,
              name: reward.productName,
              hide: reward.hide,
              replaceable: reward.replaceable,
              oldValue: reward.oldValue,
              newValue: reward.newValue,
              retailPrice: reward.sellPrice,
              inputTime: new Date().valueOf(),
              distPrice01: reward.distPrice01,
              distPrice02: reward.distPrice02,
              distPrice03: reward.distPrice03,
              distPrice04: reward.distPrice04,
              distPrice05: reward.distPrice05,
              distPrice06: reward.distPrice06,
              distPrice07: reward.distPrice07,
              distPrice08: reward.distPrice08,
              distPrice09: reward.distPrice09,
              categoryCode: reward.categoryCode,
              bundleId: reward.bundleId,
              bundleCode: reward.bundleCode,
              bundleName: reward.bundleName,
              employeeId: mechanicInformation.employeeId,
              employeeName: `${mechanicInformation.employeeName} (${mechanicInformation.employeeCode})`,
              typeCode: 'P',
              qty: selectedProduct.qty + (reward.qty * qty),
              sellPrice: sellingPrice,
              sellingPrice,
              price: sellingPrice,
              discount: reward.discount,
              disc1: reward.disc1,
              disc2: reward.disc2,
              disc3: reward.disc3
            }
            data.total = posTotal(data)
            arrayProd = arrayProd.map((item) => {
              if (item.no === selectedProduct.no) {
                return data
              }
              return item
            })
          } else {
            let sellingPrice = (memberInformation.memberSellPrice ? reward[memberInformation.memberSellPrice.toString()] : reward.sellPrice)
            if (selectedPaymentShortcut
              && selectedPaymentShortcut.sellPrice
              // eslint-disable-next-line eqeqeq
              && selectedPaymentShortcut.memberId == 0) {
              sellingPrice = reward[selectedPaymentShortcut.sellPrice] ? reward[selectedPaymentShortcut.sellPrice] : reward.sellPrice
            }
            let data = {
              no: arrayProd.length + 1,
              code: reward.productCode,
              productId: reward.productId,
              categoryCode: reward.categoryCode,
              bundleId: reward.bundleId,
              bundleCode: reward.bundleCode,
              bundleName: reward.bundleName,
              hide: reward.hide,
              replaceable: reward.replaceable,
              oldValue: reward.oldValue,
              newValue: reward.newValue,
              inputTime: new Date().valueOf(),
              retailPrice: reward.sellPrice,
              distPrice01: reward.distPrice01,
              distPrice02: reward.distPrice02,
              distPrice03: reward.distPrice03,
              distPrice04: reward.distPrice04,
              distPrice05: reward.distPrice05,
              distPrice06: reward.distPrice06,
              distPrice07: reward.distPrice07,
              distPrice08: reward.distPrice08,
              distPrice09: reward.distPrice09,
              employeeId: mechanicInformation.employeeId,
              employeeName: `${mechanicInformation.employeeName} (${mechanicInformation.employeeCode})`,
              name: reward.productName,
              typeCode: 'P',
              qty: (reward.qty * qty),
              sellPrice: sellingPrice,
              sellingPrice,
              price: sellingPrice,
              discount: reward.discount,
              disc1: reward.disc1,
              disc2: reward.disc2,
              disc3: reward.disc3
            }
            data.total = posTotal(data)
            arrayProd.push(data)
          }
        }
        // const currentGrabOrder = getGrabmartOrder()
        // arrayProd = arrayProd.map((item) => {
        //   if (item.bundleCode) {
        //     item.discount = getDiscountByBundleCode(currentGrabOrder, item.bundleCode, arrayProd)
        //     item.total = posTotal(item)
        //   }
        //   return item
        // })
        console.log('setProductPos', arrayProd)
        setCashierTrans(JSON.stringify(arrayProd))
      }
      yield put({
        type: 'updateState',
        payload: {}
      })
    },

    * setCategoryPos ({ payload = {} }, { put }) {
      const { bundleData, currentReward } = payload
      if (currentReward && currentReward.length > 0) {
        yield put({
          type: 'updateState',
          payload: {
            currentReward: currentReward[0],
            bundleData
          }
        })
        if (currentReward[0].type === 'P') {
          console.log('setCategoryPos', payload)
          yield put({
            type: 'pos/openBundleCategory',
            payload: {
              bundleId: bundleData.item.id,
              mode: 'add',
              currentBundle: bundleData.item
            }
          })
        } else if (currentReward[0].type === 'S') {
          yield put({
            type: 'pos/openBundleCategory',
            payload: {
              bundleId: bundleData.item.id,
              mode: 'add',
              currentBundle: bundleData.item
            }
          })
        }
      }
    },

    * setServicePos ({ payload = {} }, { select, put }) {
      const mechanicInformation = yield select(({ pos }) => pos.mechanicInformation)
      let currentProduct = payload.currentProduct
      let currentReward = payload.currentReward
      const { qty = 1 } = payload
      let arrayProd = currentProduct
      if (currentReward && currentReward[0]) {
        for (let key in currentReward) {
          const reward = currentReward[key]
          // eslint-disable-next-line no-loop-func
          const filteredProduct = currentProduct.filter(x => Number(x.productId) === Number(reward.productId) && x.bundleId === reward.bundleId && x.categoryCode === reward.categoryCode)
          if (filteredProduct && filteredProduct[0]) {
            const selectedProduct = filteredProduct[0]
            let data = {
              no: selectedProduct.no,
              code: reward.productCode,
              productId: reward.serviceId,
              name: reward.productName,
              categoryCode: reward.categoryCode,
              bundleId: reward.bundleId,
              bundleCode: reward.bundleCode,
              bundleName: reward.bundleName,
              employeeId: mechanicInformation.employeeId,
              employeeName: `${mechanicInformation.employeeName} (${mechanicInformation.employeeCode})`,
              typeCode: 'S',
              inputTime: new Date().valueOf(),
              qty: selectedProduct.qty + (reward.qty * qty),
              sellPrice: reward.sellPrice,
              sellingPrice: reward.sellPrice,
              price: reward.sellPrice,
              discount: reward.discount,
              disc1: reward.disc1,
              disc2: reward.disc2,
              disc3: reward.disc3
            }
            data.total = posTotal(data)
            arrayProd = arrayProd.map((item) => {
              if (item.no === selectedProduct.no) {
                return data
              }
              return item
            })
          } else {
            let data = {
              no: arrayProd.length + 1,
              code: reward.productCode,
              productId: reward.serviceId,
              name: reward.productName,
              categoryCode: reward.categoryCode,
              bundleId: reward.bundleId,
              bundleCode: reward.bundleCode,
              bundleName: reward.bundleName,
              employeeId: mechanicInformation.employeeId,
              employeeName: `${mechanicInformation.employeeName} (${mechanicInformation.employeeCode})`,
              typeCode: 'S',
              inputTime: new Date().valueOf(),
              qty: (reward.qty * qty),
              sellPrice: reward.sellPrice,
              sellingPrice: reward.sellPrice,
              price: reward.sellPrice,
              discount: reward.discount,
              disc1: reward.disc1,
              disc2: reward.disc2,
              disc3: reward.disc3
            }
            data.total = posTotal(data)
            arrayProd.push(data)
          }
        }
        setServiceTrans(JSON.stringify(arrayProd))
      }
      yield put({
        type: 'updateState',
        payload: {}
      })
    }
  },

  reducers: {
    updateState (state, { payload }) {
      return { ...state, ...payload }
    },

    setAllNull (state) {
      return {
        ...state,
        currentReward: {},
        bundleData: {},
        listCategory: [],
        productData: {},
        serviceData: {}
      }
    },

    changeTab (state, { payload }) {
      const { key } = payload
      return {
        ...state,
        activeKey: key,
        modalType: 'add',
        currentItem: {}
      }
    }
  }
})

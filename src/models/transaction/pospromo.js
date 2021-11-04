import modelExtend from 'dva-model-extend'
import { message, Modal } from 'antd'
import { posTotal } from 'utils'
import { setCashierTrans, setServiceTrans, setBundleTrans } from 'utils/lstorage'
import { query } from '../../services/marketing/bundling'
import { query as queryReward } from '../../services/marketing/bundlingReward'
import { pageModel } from './../common'

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
      if (itemRewardCategory.length === 0) {
        yield put({
          type: 'setProductPos',
          payload: {
            currentProduct,
            currentReward: itemRewardProduct
          }
        })
        yield put({
          type: 'setServicePos',
          payload: {
            currentProduct: currentService,
            currentReward: itemRewardService
          }
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            productData: {
              currentProduct,
              currentReward: itemRewardProduct
            },
            serviceData: {
              currentProduct: currentService,
              currentReward: itemRewardService
            }
          }
        })
      }
      yield put({
        type: 'setCategoryPos',
        payload: {
          currentReward: itemRewardCategory,
          bundleData
        }
      })
    },


    * addPosPromo ({ payload = {} }, { call, select, put }) {
      const memberInformation = yield select(({ pos }) => pos.memberInformation)
      if (!memberInformation || JSON.stringify(memberInformation) === '{}') {
        const modal = Modal.warning({
          title: 'Warning',
          content: 'Member Not Found...!'
        })
        setTimeout(() => modal.destroy(), 1000)
        return
      }

      const { bundleId, currentBundle, currentProduct, currentService } = payload
      const data = yield call(query, { id: bundleId })
      const dataReward = yield call(queryReward, { bundleId, type: 'all' })
      if (data.success && dataReward.success && dataReward.data && dataReward.data.length > 0) {
        const item = data.data[0]
        const itemRewardProduct = dataReward.data.filter(x => x.type === 'P' && x.categoryCode === null)
        const itemRewardService = dataReward.data.filter(x => x.type !== 'P' && x.categoryCode === null)
        const itemRewardCategory = dataReward.data.filter(x => x.categoryCode !== null)
        const resultCompareBundle = currentBundle.filter(filtered => filtered.bundleId === item.id)
        // eslint-disable-next-line eqeqeq
        if (resultCompareBundle && resultCompareBundle[0] && item.applyMultiple == 0) {
          Modal.warning({
            title: 'Cannot Apply Multiple to this promo',
            content: 'Call your stock administrator for this issue'
          })
          return
        }

        const exists = resultCompareBundle ? resultCompareBundle[0] : undefined
        const categoryExists = itemRewardCategory ? itemRewardCategory[0] : undefined

        if (!categoryExists) {
          if (exists) {
            yield put({
              type: 'setBundleAlreadyExists',
              payload: {
                currentBundle,
                item
              }
            })
          } else {
            yield put({
              type: 'setBundleNeverExists',
              payload: {
                currentBundle,
                item
              }
            })
          }
        } else {
          yield put({
            type: 'updateState',
            payload: {
              currentReward: categoryExists
            }
          })
        }
        yield put({
          type: 'addPosPromoItem',
          payload: {
            bundleData: {
              currentBundle,
              item
            },
            currentProduct,
            itemRewardProduct,
            currentService,
            itemRewardService,
            itemRewardCategory
          }
        })
        message.success('Success add bundle')
      } else {
        if (dataReward.data && dataReward.data.length === 0) {
          Modal.error({
            title: 'Data Not Found',
            content: 'Reward and Rules Not Found'
          })
        }
        throw data
      }
    },
    * setBundleAlreadyExists ({ payload = {} }, { put }) {
      const currentBundle = payload.currentBundle
      const item = payload.item
      let arrayProd = currentBundle.map((data) => {
        if (data.bundleId === item.id) {
          return ({
            ...data,
            qty: parseFloat(data.qty) + 1
          })
        }
        return data
      })
      setBundleTrans(JSON.stringify(arrayProd))
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
        applyMultiple: item.applyMultiple,
        bundleId: item.id,
        categoryCode: item.categoryCode,
        type: item.type,
        code: item.code,
        name: item.name,
        alwaysOn: item.alwaysOn,
        haveTargetPrice: item.haveTargetPrice,
        targetRetailPrice: item.targetRetailPrice,
        targetCostPrice: item.targetCostPrice,
        startDate: item.startDate,
        endDate: item.endDate,
        startHour: item.startHour,
        endHour: item.endHour,
        availableDate: item.availableDate,
        qty: 1
      })
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
      let arrayProd = currentProduct
      if (currentReward && currentReward[0]) {
        for (let key in currentReward) {
          const reward = currentReward[key]
          // eslint-disable-next-line no-loop-func
          // eslint-disable-next-line eqeqeq
          const filteredProduct = currentProduct.filter(x => x.productId === reward.productId && x.bundleId == reward.bundleId && x.categoryCode == reward.categoryCode)
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
              retailPrice: reward.sellPrice,
              distPrice01: reward.distPrice01,
              distPrice02: reward.distPrice02,
              distPrice03: reward.distPrice03,
              distPrice04: reward.distPrice04,
              distPrice05: reward.distPrice05,
              categoryCode: reward.categoryCode,
              bundleId: reward.bundleId,
              bundleCode: reward.bundleCode,
              bundleName: reward.bundleName,
              employeeId: mechanicInformation.employeeId,
              employeeName: `${mechanicInformation.employeeName} (${mechanicInformation.employeeCode})`,
              typeCode: 'P',
              qty: selectedProduct.qty + reward.qty,
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
              retailPrice: reward.sellPrice,
              distPrice01: reward.distPrice01,
              distPrice02: reward.distPrice02,
              distPrice03: reward.distPrice03,
              distPrice04: reward.distPrice04,
              distPrice05: reward.distPrice05,
              employeeId: mechanicInformation.employeeId,
              employeeName: `${mechanicInformation.employeeName} (${mechanicInformation.employeeCode})`,
              name: reward.productName,
              typeCode: 'P',
              qty: reward.qty,
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
          // yield put({
          //   type: 'pos/showProductModal',
          //   payload: {
          //     modalType: 'browseProductLock'
          //   }
          // })
          yield put({
            type: 'pos/openVoidSuspend',
            payload: {
              bundleId: bundleData.item.id,
              mode: 'add'
            }
          })
        }
        if (currentReward[0].type === 'S') {
          // yield put({
          //   type: 'pos/showServiceModal',
          //   payload: {
          //     modalType: 'browseService'
          //   }
          // })

          yield put({
            type: 'pos/openVoidSuspend',
            payload: {
              bundleId: bundleData.item.id,
              mode: 'add'
            }
          })
        }
      }
    },

    * setServicePos ({ payload = {} }, { select, put }) {
      const mechanicInformation = yield select(({ pos }) => pos.mechanicInformation)
      let currentProduct = payload.currentProduct
      let currentReward = payload.currentReward
      let arrayProd = currentProduct
      if (currentReward && currentReward[0]) {
        for (let key in currentReward) {
          const reward = currentReward[key]
          // eslint-disable-next-line no-loop-func
          const filteredProduct = currentProduct.filter(x => x.productId === reward.productId && x.bundleId === reward.bundleId && x.categoryCode === reward.categoryCode)
          if (filteredProduct && filteredProduct[0]) {
            const selectedProduct = filteredProduct[0]
            let data = {
              no: selectedProduct.no,
              code: reward.productCode,
              productId: reward.productId,
              name: reward.productName,
              categoryCode: reward.categoryCode,
              bundleId: reward.bundleId,
              bundleCode: reward.bundleCode,
              bundleName: reward.bundleName,
              employeeId: mechanicInformation.employeeId,
              employeeName: `${mechanicInformation.employeeName} (${mechanicInformation.employeeCode})`,
              typeCode: 'S',
              qty: selectedProduct.qty + reward.qty,
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
              productId: reward.productId,
              name: reward.productName,
              categoryCode: reward.categoryCode,
              bundleId: reward.bundleId,
              bundleCode: reward.bundleCode,
              bundleName: reward.bundleName,
              employeeId: mechanicInformation.employeeId,
              employeeName: `${mechanicInformation.employeeName} (${mechanicInformation.employeeCode})`,
              typeCode: 'S',
              qty: reward.qty,
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

import modelExtend from 'dva-model-extend'
import { Modal } from 'antd'
import { compare, posTotal } from 'utils'
import { query } from '../../services/marketing/bundling'
import { query as queryRules } from '../../services/marketing/bundlingRules'
import { query as queryReward } from '../../services/marketing/bundlingReward'
import { pageModel } from './../common'

const { compareExistsById, compareBundleExists } = compare

export default modelExtend(pageModel, {
  namespace: 'pospromo',

  state: {
    currentItem: {},
    modalType: 'add',
    activeKey: '0',
    searchText: null,
    typeModal: null,
    modalPromoVisible: false,
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
    * addPosPromo ({ payload = {} }, { call, put }) {
      const { bundleId, currentBundle, currentProduct, currentService, reject, resolve, ...other } = payload
      const data = yield call(query, { id: bundleId })
      const dataRules = yield call(queryRules, { bundleId, ...other })
      const dataReward = yield call(queryReward, { bundleId, ...other })
      if (data.success && dataRules.success && dataReward.success) {
        const item = data.data[0]
        // const itemRulesProduct = dataRules.data.filter(x => x.type === 'P')
        // const itemRulesService = dataRules.data.filter(x => x.type !== 'P')
        const itemRewardProduct = dataReward.data.filter(x => x.type === 'P')
        const itemRewardService = dataReward.data.filter(x => x.type !== 'P')
        if (item && dataRules.data && dataReward.data) {
          const resultCompareBundle = compareBundleExists(currentBundle, item)
          // const resultCompareRulesProductRequired = compareExistsByIdAndQty(currentProduct, itemRulesProduct)
          // const resultCompareRulesServiceRequired = compareExistsByIdAndQty(currentService, itemRulesService)
          // const resultCompareRulesProduct = compareExistsById(currentProduct, itemRulesProduct)
          // const resultCompareRulesService = compareExistsById(currentService, itemRulesService)
          const resultCompareRewardProduct = compareExistsById(currentProduct, itemRewardProduct)
          const resultCompareRewardService = compareExistsById(currentService, itemRewardService)
          const result = resultCompareRewardProduct.data || resultCompareRewardService.data
          const status = resultCompareRewardProduct.status || resultCompareRewardService.status
          if (resultCompareBundle.status && item.applyMultiple === '0') {
            Modal.warning({
              title: 'Cannot Apply Multiple to this promo',
              content: 'Call your stock administrator for this issue'
            })
          } else if (status) {
            const confirmPromise = () => {
              const data = new Promise((resolve, reject) => {
                Modal.confirm({
                  title: `Promo's Item ${result.productName} is exists in transaction`,
                  content: 'Do you want to add promo belong to exists item ?',
                  onOk () {
                    resolve()
                  },
                  onCancel () {
                    reject()
                  }
                })
              })
              return data
            }
            yield confirmPromise()
            if (!resultCompareBundle.status) {
              yield put({
                type: 'setBundleNeverExists',
                payload: {
                  currentBundle,
                  item
                }
              })
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
              payload.resolve('done')
            } else if (resultCompareBundle.status && item.applyMultiple === '1') {
              yield put({
                type: 'setBundleAlreadyExists',
                payload: {
                  currentBundle,
                  item
                }
              })
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
            }
            payload.resolve('done')
          } else if (!resultCompareBundle.status) {
            yield put({
              type: 'setBundleNeverExists',
              payload: {
                currentBundle,
                item
              }
            })
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
            payload.resolve('done')
          } else if (resultCompareBundle.status && item.applyMultiple === '1') {
            yield put({
              type: 'setBundleAlreadyExists',
              payload: {
                currentBundle,
                item
              }
            })
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
            payload.resolve('done')
          }
        } else {
          Modal.warning({
            title: 'Data Success but found nothing',
            content: 'Please Restart Your Transaction'
          })
        }
      } else {
        payload.reject('error')
        throw data
      }
    },
    * setBundleAlreadyExists ({ payload = {} }, { put }) {
      let arrayProd = []
      const currentBundle = payload.currentBundle
      const item = payload.item
      for (let n = 0; n < (currentBundle || []).length; n += 1) {
        if (currentBundle[n].bundleId === item.id) {
          arrayProd.push({
            no: (arrayProd || []).length + 1,
            applyMultiple: currentBundle[n].applyMultiple,
            bundleId: currentBundle[n].bundleId,
            type: currentBundle[n].type,
            code: currentBundle[n].code,
            name: currentBundle[n].name,
            startDate: currentBundle[n].startDate,
            endDate: currentBundle[n].endDate,
            startHour: currentBundle[n].startHour,
            endHour: currentBundle[n].endHour,
            availableDate: currentBundle[n].availableDate,
            qty: parseFloat(currentBundle[n].qty) + 1
          })
        } else {
          arrayProd.push({
            no: (arrayProd || []).length + 1,
            applyMultiple: currentBundle[n].applyMultiple,
            bundleId: currentBundle[n].bundleId,
            type: currentBundle[n].type,
            code: currentBundle[n].code,
            name: currentBundle[n].name,
            startDate: currentBundle[n].startDate,
            endDate: currentBundle[n].endDate,
            startHour: currentBundle[n].startHour,
            endHour: currentBundle[n].endHour,
            availableDate: currentBundle[n].availableDate,
            qty: currentBundle[n].qty
          })
        }
        localStorage.setItem('bundle_promo', JSON.stringify(arrayProd))
      }
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
        type: item.type,
        code: item.code,
        name: item.name,
        startDate: item.startDate,
        endDate: item.endDate,
        startHour: item.startHour,
        endHour: item.endHour,
        availableDate: item.availableDate,
        qty: 1
      })
      localStorage.setItem('bundle_promo', JSON.stringify(currentBundle))
      yield put({
        type: 'updateState',
        payload: {}
      })
    },
    * setProductPos ({ payload = {} }, { select, put }) {
      const memberInformation = yield select(({ pos }) => pos.memberInformation)
      const mechanicInformation = yield select(({ pos }) => pos.mechanicInformation)
      let currentProduct = payload.currentProduct
      let currentReward = payload.currentReward
      Array.prototype.remove = function () {
        let what
        let a = arguments
        let L = a.length
        let ax
        while (L && this.length) {
          what = a[L -= 1]
          while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1)
          }
        }
        return this
      }
      let arrayProd = currentProduct
      if ((currentReward || []).length > 0) {
        for (let n = 0; n < currentReward.length; n += 1) {
          const filteredProduct = currentProduct.filter(x => x.productId === currentReward[n].productId && x.bundleId === currentReward[n].bundleId)
          if ((filteredProduct || []).length > 0) {
            let ary = currentProduct
            ary.remove(filteredProduct[0].no - 1)
            let data = {
              no: filteredProduct[0].no,
              code: currentReward[n].productCode,
              productId: currentReward[n].productId,
              name: currentReward[n].productName,
              bundleId: currentReward[n].bundleId,
              bundleName: currentReward[n].bundleName,
              employeeId: mechanicInformation.employeeId,
              employeeName: `${mechanicInformation.employeeName} (${mechanicInformation.employeeCode})`,
              typeCode: 'P',
              qty: filteredProduct[0].qty + currentReward[n].qty,
              sellPrice: currentReward[n].sellingPrice,
              sellingPrice: currentReward[n].sellingPrice,
              price: currentReward[n].sellingPrice,
              discount: currentReward[n].discount,
              disc1: currentReward[n].disc1,
              disc2: currentReward[n].disc2,
              disc3: currentReward[n].disc3
            }
            data.total = posTotal(data)
            arrayProd[filteredProduct[0].no - 1] = data
          } else {
            let data = {
              no: arrayProd.length + 1,
              code: currentReward[n].productCode,
              productId: currentReward[n].productId,
              bundleId: currentReward[n].bundleId,
              bundleName: currentReward[n].bundleName,
              employeeId: mechanicInformation.employeeId,
              employeeName: `${mechanicInformation.employeeName} (${mechanicInformation.employeeCode})`,
              name: currentReward[n].productName,
              typeCode: 'P',
              qty: currentReward[n].qty,
              sellPrice: memberInformation.showAsDiscount ? currentReward[n].sellPrice : currentReward[n][memberInformation.memberSellPrice.toString()],
              sellingPrice: (memberInformation.memberSellPrice ? currentReward[n][memberInformation.memberSellPrice.toString()] : currentReward[n].sellPrice),
              price: (memberInformation.memberSellPrice ? currentReward[n][memberInformation.memberSellPrice.toString()] : currentReward[n].sellPrice),
              discount: currentReward[n].discount,
              disc1: currentReward[n].disc1,
              disc2: currentReward[n].disc2,
              disc3: currentReward[n].disc3
            }
            data.total = posTotal(data)
            arrayProd.push(data)
          }
        }
        localStorage.setItem('cashier_trans', JSON.stringify(arrayProd))
      }
      yield put({
        type: 'updateState',
        payload: {}
      })
    },
    * setServicePos ({ payload = {} }, { select, put }) {
      const mechanicInformation = yield select(({ pos }) => pos.mechanicInformation)
      let currentProduct = payload.currentProduct
      let currentReward = payload.currentReward
      Array.prototype.remove = function () {
        let what
        let a = arguments
        let L = a.length
        let ax
        while (L && this.length) {
          what = a[L -= 1]
          while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1)
          }
        }
        return this
      }
      let arrayProd = currentProduct
      if ((currentReward || []).length > 0) {
        for (let n = 0; n < currentReward.length; n += 1) {
          const filteredProduct = currentProduct.filter(x => x.productId === currentReward[n].productId && x.bundleId === currentReward[n].bundleId)
          if ((filteredProduct || []).length > 0) {
            let ary = currentProduct
            ary.remove(filteredProduct[0].no - 1)
            let data = {
              no: filteredProduct[0].no,
              code: currentReward[n].productCode,
              productId: currentReward[n].productId,
              name: currentReward[n].productName,
              bundleId: currentReward[n].bundleId,
              bundleName: currentReward[n].bundleName,
              employeeId: mechanicInformation.employeeId,
              employeeName: `${mechanicInformation.employeeName} (${mechanicInformation.employeeCode})`,
              typeCode: 'S',
              qty: filteredProduct[0].qty + currentReward[n].qty,
              sellPrice: currentReward[n].sellingPrice,
              sellingPrice: currentReward[n].sellingPrice,
              price: currentReward[n].sellingPrice,
              discount: currentReward[n].discount,
              disc1: currentReward[n].disc1,
              disc2: currentReward[n].disc2,
              disc3: currentReward[n].disc3
            }
            data.total = posTotal(data)
            arrayProd[filteredProduct[0].no - 1] = data
          } else {
            let data = {
              no: arrayProd.length + 1,
              code: currentReward[n].productCode,
              productId: currentReward[n].productId,
              bundleId: currentReward[n].bundleId,
              bundleName: currentReward[n].bundleName,
              employeeId: mechanicInformation.employeeId,
              employeeName: `${mechanicInformation.employeeName} (${mechanicInformation.employeeCode})`,
              name: currentReward[n].productName,
              typeCode: 'S',
              qty: currentReward[n].qty,
              sellPrice: currentReward[n].sellingPrice,
              sellingPrice: currentReward[n].sellingPrice,
              discount: currentReward[n].discount,
              disc1: currentReward[n].disc1,
              disc2: currentReward[n].disc2,
              disc3: currentReward[n].disc3
            }
            data.total = posTotal(data)
            arrayProd.push({
              no: arrayProd.length + 1,
              code: data.code,
              productId: data.productId,
              name: data.name,
              bundleId: data.bundleId,
              bundleName: data.bundleName,
              employeeId: data.employeeId,
              employeeName: data.employeeName,
              typeCode: 'S',
              qty: data.qty,
              sellPrice: data.sellingPrice,
              price: data.sellingPrice,
              discount: data.discount,
              disc1: data.disc1,
              disc2: data.disc2,
              disc3: data.disc3,
              total: data.total
            })
          }
        }
        localStorage.setItem('service_detail', JSON.stringify(arrayProd))
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

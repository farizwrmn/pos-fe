import modelExtend from 'dva-model-extend'
import { message, Modal } from 'antd'
import { routerRedux } from 'dva/router'
import { configMain } from 'utils'
import moment from 'moment'
import { query, queryById, add, edit, queryPOSproduct, queryPOSproductStore, remove } from '../../services/master/productstock'
import { add as addVariantStock } from '../../services/master/variantStock'
import { addSome as addSomeSpecificationStock, edit as editSpecificationStock } from '../../services/master/specificationStock'
import { pageModel } from './../common'

const { prefix } = configMain

const success = (messages) => {
  message.success(messages)
}

export default modelExtend(pageModel, {
  namespace: 'productstock',

  state: {
    currentItem: {},
    modalType: 'add',
    display: 'none',
    isChecked: false,
    selectedRowKeys: [],
    activeKey: '0',
    disable: '',
    searchText: '',
    advancedForm: true,
    show: 1,
    showModal: false,
    showModalProduct: false,
    modalProductType: '',
    listPrintAllStock: [],
    filteredInfo: {},
    modalVariantVisible: false,
    modalSpecificationVisible: false,
    modalProductVisible: false,
    listItem: [],
    listSticker: [],
    update: false,
    selectedSticker: {},
    period: [],
    showPDFModal: false,
    mode: '',
    changed: false,
    stockLoading: false,
    countStoreList: [],
    modalQuantityVisible: false,
    aliases: {
      check1: true,
      check2: false,
      price1: 'sellPrice',
      price2: 'distPrice01',
      alias1: 'RETAIL PRICE',
      alias2: ''
    },
    pagination: {
      current: 1,
      showSizeChanger: true
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { activeKey, ...other } = location.query
        const { pathname } = location
        if (pathname === '/stock') {
          if (!activeKey) dispatch({ type: 'refreshView' })
          if (activeKey === '1') dispatch({ type: 'query', payload: other })
          dispatch({
            type: 'updateState',
            payload: {
              changed: false,
              activeKey: activeKey || '0',
              listSticker: [],
              listItem: []
            }
          })
        } else if (pathname === '/master/product/sticker') {
          if (!activeKey) dispatch({ type: 'refreshView' })
        }
      })
    }
  },

  effects: {
    * queryItem ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data.success) {
        yield put({
          type: 'querySuccessItem',
          payload: data.data
        })
      }
    },

    * checkLengthOfData ({ payload = {} }, { call, put }) {
      yield put({ type: 'showLoading' })
      const data = yield call(query, payload)
      yield put({ type: 'hideLoading' })
      if (data.success) {
        if (data.data.length > 0) {
          Modal.warning({
            title: 'Your Data is too many, please print out with using Excel'
          })
        } else {
          yield put({ type: 'queryAllStock', payload: { type: 'all' } })
        }
      }
    },

    * queryAllStock ({ payload = {} }, { call, put }) {
      yield put({ type: 'showLoading' })
      const data = yield call(query, payload)
      yield put({ type: 'hideLoading' })
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listPrintAllStock: data.data,
            changed: true
          }
        })
      }
    },

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total
            }
          }
        })
        yield put({
          type: 'showProductQty',
          payload: {
            data: data.data
          }
        })
      }
    },

    * showProductQty ({ payload }, { call, put }) {
      let { data } = payload
      const storeInfo = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : {}
      const newData = data.map(x => x.id)

      const listProductData = yield call(queryPOSproduct, { from: storeInfo.startPeriod, to: moment().format('YYYY-MM-DD'), product: (newData || []).toString() })
      if (listProductData.success) {
        for (let n = 0; n < (listProductData.data || []).length; n += 1) {
          data = data.map((x) => {
            if (x.id === listProductData.data[n].id) {
              const { count, ...other } = x
              return {
                ...other,
                ...listProductData.data[n]
              }
            }
            return x
          })
        }

        yield put({
          type: 'querySuccess',
          payload: {
            list: data,
            pagination: {}
          }
        })
      } else {
        throw listProductData
      }
    },

    * showProductStoreQty ({ payload }, { call, put }) {
      let { data } = payload
      const storeInfo = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : {}
      const newData = data.map(x => x.id)

      const listProductData = yield call(queryPOSproductStore, { from: storeInfo.startPeriod, to: moment().format('YYYY-MM-DD'), product: (newData || []).toString() })
      if (listProductData.success) {
        yield put({
          type: 'updateState',
          payload: {
            countStoreList: listProductData.data,
            modalQuantityVisible: true
          }
        })
      } else {
        throw listProductData
      }
    },

    * queryItemById ({ payload = {} }, { call, put }) {
      const data = yield call(queryById, payload)
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: data.data
          }
        })
      } else {
        throw data
      }
    },

    * delete ({ payload }, { call, put, select }) {
      const data = yield call(remove, { id: payload })
      const { selectedRowKeys } = yield select(_ => _.productstock)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * add ({ payload }, { call, put, select }) {
      const modalType = yield select(({ productstock }) => productstock.modalType)
      const listSpecification = yield select(({ specification }) => specification.listSpecification)

      const data = yield call(add, { id: payload.id, data: payload.data })
      if (data.success) {
        let loadData = {}
        if (payload.data.useVariant) {
          loadData = {
            productParentId: !payload.data.variant && payload.data.productParentId ? payload.data.productParentId : data.stock.id,
            productId: data.stock.id,
            variantId: payload.data.variantId
          }
          yield call(addVariantStock, loadData)
        }
        let listSpecificationCode = []
        if (modalType === 'add') {
          listSpecificationCode = listSpecification.map((x) => {
            return {
              productId: data.stock.id,
              specificationId: x.id,
              name: x.name,
              value: x.value
            }
          })
        }
        if ((listSpecificationCode || []).length > 0) {
          yield call(addSomeSpecificationStock, { data: listSpecificationCode })
        }
        // yield put({ type: 'query' })
        success('Stock Product has been saved')
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {}
          }
        })
      } else {
        let current = Object.assign({}, payload.id, payload.data)
        yield put({
          type: 'updateState',
          payload: {
            currentItem: current
          }
        })
        throw data
      }
    },

    * edit ({ payload }, { select, call, put }) {
      const id = yield select(({ productstock }) => productstock.currentItem.productCode)
      const productId = yield select(({ productstock }) => productstock.currentItem.id)
      const newProductStock = { ...payload, id }
      const data = yield call(edit, newProductStock)
      let listSpecificationCode = yield select(({ specificationStock }) => specificationStock.listSpecificationCode)
      const typeInput = yield select(({ specificationStock }) => specificationStock.typeInput)
      let loadData = {}
      if (data.success) {
        if ((listSpecificationCode || []).length > 0) {
          if (typeInput === 'edit') {
            for (let n = 0; n < listSpecificationCode.length; n += 1) {
              yield call(editSpecificationStock, {
                id: listSpecificationCode[n].id,
                productId: listSpecificationCode[n].productId,
                specificationId: listSpecificationCode[n].specificationId,
                value: listSpecificationCode[n].value
              })
            }
          } else if (typeInput === 'add') {
            listSpecificationCode = listSpecificationCode.map((x) => {
              return {
                productId,
                specificationId: x.id,
                name: x.name,
                value: x.value
              }
            })
            yield call(addSomeSpecificationStock, { data: listSpecificationCode })
          }
        }
        if (payload.data.useVariant) {
          loadData = {
            productParentId: !payload.data.variant && payload.data.productParentId ? payload.data.productParentId : data.stock.id,
            productParentName: payload.data.productParentName,
            productId: data.stock.id,
            productName: payload.data.productName,
            variantId: payload.data.variantId,
            variantName: payload.data.variantName
          }
          const dataVariant = yield call(addVariantStock, loadData)
          if (dataVariant.success) {
            success('Stock Product has been saved')
            success('Variant Product has been saved')
            yield put({
              type: 'updateState',
              payload: {
                modalType: 'add',
                currentItem: {},
                activeKey: '1'
              }
            })
            const { pathname } = location
            yield put(routerRedux.push({
              pathname,
              query: {
                activeKey: '1'
              }
            }))
          } else {
            yield put({
              type: 'updateState',
              payload: {
                currentItem: {
                  ...payload.data,
                  variantId: null,
                  variantName: null
                }
              }
            })
            throw dataVariant
          }
        } else {
          success('Stock Product has been saved')
          yield put({
            type: 'updateState',
            payload: {
              modalType: 'add',
              currentItem: {},
              activeKey: '1'
            }
          })
          const { pathname } = location
          yield put(routerRedux.push({
            pathname,
            query: {
              activeKey: '1'
            }
          }))
          yield put({ type: 'query' })
        }
      } else {
        let current = Object.assign({}, payload.id, payload.data)
        yield put({
          type: 'updateState',
          payload: {
            currentItem: current
          }
        })
        throw data
      }
    }
  },

  reducers: {
    showLoading (state) {
      return {
        ...state,
        stockLoading: true
      }
    },

    hideLoading (state) {
      return {
        ...state,
        stockLoading: false
      }
    },

    querySuccessItem (state, { payload }) {
      return { ...state, listItem: payload }
    },

    switchIsChecked (state, { payload }) {
      return { ...state, isChecked: !state.isChecked, display: payload }
    },

    changeTab (state, { payload }) {
      return { ...state, ...payload }
    },

    resetItem (state, { payload }) {
      return { ...state, ...payload }
    },

    pushSticker (state, { payload }) {
      state.listSticker.push()
      return { ...state, ...payload }
    },

    updateState (state, { payload }) {
      return { ...state, ...payload }
    },

    addSticker (state, { payload }) {
      const { sticker } = payload
      state.listSticker.push(sticker)
      return { ...state }
    },

    deleteSticker (state, { payload }) {
      const { sticker } = payload
      state.listSticker = state.listSticker.filter(x => x.name !== sticker.name)
      return { ...state }
    },

    updateSticker (state, { payload }) {
      const { selectedRecord, changedRecord } = payload
      let selected = state.listSticker.findIndex(x => x.info.id === selectedRecord.info.id)
      state.listSticker[selected] = changedRecord
      return { ...state }
    },

    resetProductStockList (state) {
      return { ...state, list: [], pagination: { total: 0 } }
    },

    getAutoText (state, action) {
      const { data, text } = action.payload
      const reg = new RegExp(text, 'gi')
      let productNames
      if (text.length > 0) {
        productNames = data.map((record) => {
          const match = record.productName.match(reg)
          if (!match) {
            return null
          }
          return {
            ...record
          }
        }).filter(record => !!record)
      } else {
        productNames = []
      }
      return { ...state, auto: productNames }
    },

    refreshView (state) {
      return {
        ...state,
        activeKey: '0',
        modalType: 'add',
        currentItem: {}
      }
    }

  }
})

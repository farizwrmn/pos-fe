import modelExtend from 'dva-model-extend'
import { message, Modal } from 'antd'
import { routerRedux } from 'dva/router'
import { configMain } from 'utils'
import { query as querySequence } from 'services/sequence'
import { queryInventoryType } from 'services/transType'
import moment from 'moment'
import FormData from 'form-data'
import { queryFifo } from 'services/report/fifo'
import { uploadProductImage } from 'services/utils/imageUploader'
import { query, queryById, add, edit, queryPOSproduct, queryPOSproductStore, remove } from '../../services/master/productstock'
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
    lastTrans: '',
    activeKey: '0',
    disable: '',
    searchText: '',
    advancedForm: true,
    show: 1,
    showModal: false,
    showModalProduct: false,
    modalProductType: '',
    listPrintAllStock: [],
    listInventory: [],
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
    inventoryMode: null,
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
        const { activeKey, mode, ...other } = location.query
        const { pathname } = location
        switch (pathname) {
          case '/integration/marketplace-product':
          case '/master/store-price':
          case '/report/fifo/history':
          case '/report/fifo/card':
            dispatch({ type: 'query' })
            break
          default:
        }
        if (pathname === '/stock') {
          dispatch({ type: 'queryLastAdjust' })
          dispatch({ type: 'loadDataValue' })
          if (!activeKey) dispatch({ type: 'refreshView' })
          if (activeKey === '1') {
            if (mode === 'inventory') {
              dispatch({
                type: 'queryInventory',
                payload: {
                  period: moment().format('MM'),
                  year: moment().format('YYYY')
                }
              })
            } else {
              dispatch({
                type: 'query',
                payload: {
                  ...other,
                  stockQuery: true
                }
              })
            }
          }
          dispatch({
            type: 'updateState',
            payload: {
              changed: false,
              activeKey: activeKey || '0',
              listSticker: [],
              listItem: [],
              inventoryMode: mode
            }
          })
        } else if (pathname === '/master/product/sticker') {
          if (!activeKey) dispatch({ type: 'refreshView' })
        }
      })
    }
  },

  effects: {
    * loadDataValue ({ payload = {} }, { call, put }) {
      const dataType = yield call(queryInventoryType, payload)
      if (dataType.success && dataType.data && dataType.data.length > 0) {
        yield put({
          type: 'updateState',
          payload: { listInventory: dataType.data }
        })
      }
    },

    * queryLastAdjust ({ payload = {} }, { call, put }) {
      const invoice = {
        seqCode: 'PS',
        type: 1,
        ...payload
      }
      const data = yield call(querySequence, invoice)
      const transNo = data.data
      yield put({ type: 'SuccessTransNo', payload: transNo })
    },

    * queryItem ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data.success) {
        yield put({
          type: 'querySuccessItem',
          payload: data.data
        })
      }
    },

    * queryInventory ({ payload = {} }, { call, put }) {
      const date = payload
      yield put({
        type: 'setPeriod',
        payload: date
      })
      yield put({
        type: 'setNull',
        payload: date
      })
      const data = yield call(queryFifo, payload)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data && data.data.length > 0
              ? data.data
                .filter(filtered => filtered.count > 0)
                .sort((a, b) => b.count - a.count)
              : [],
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total
            }
          }
        })
        yield put({
          type: 'updateState',
          payload: {
            pagination: undefined
          }
        })
      } else {
        throw data
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
      const { stockQuery, ...otherPayload } = payload
      const data = yield call(query, otherPayload)
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
        if (stockQuery) {
          yield put({
            type: 'showProductQty',
            payload: {
              data: data.data
            }
          })
        }
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
        yield put({ type: 'query', payload: { stockQuery: true } })
      } else {
        throw data
      }
    },

    * add ({ payload }, { call, put }) {
      // Start - Upload Image
      const uploadedImage = []
      if (payload
        && payload.data
        && payload.data.productImage
        && payload.data.productImage.fileList
        && payload.data.productImage.fileList.length > 0
        && payload.data.productImage.fileList.length <= 5) {
        for (let key in payload.data.productImage.fileList) {
          const item = payload.data.productImage.fileList[key]
          const formData = new FormData()
          formData.append('file', item.originFileObj)
          const responseUpload = yield call(uploadProductImage, formData)
          if (responseUpload.success && responseUpload.data && responseUpload.data.filename) {
            uploadedImage.push(responseUpload.data.filename)
          }
        }
      } else if (payload
        && payload.data
        && payload.data.productImage
        && payload.data.productImage.fileList
        && payload.data.productImage.fileList.length > 0
        && payload.data.productImage.fileList.length > 5) {
        throw new Error('Cannot upload more than 5 image')
      }
      if (uploadedImage && uploadedImage.length) {
        payload.data.productImage = uploadedImage
      } else {
        payload.data.productImage = '["no_image.png"]'
      }
      // End - Upload Image
      const data = yield call(add, { id: payload.id, data: payload.data })
      if (data.success) {
        if (payload.reset) {
          payload.reset()
        }
        // yield put({ type: 'query' })
        success('Stock Product has been saved')
        yield put({
          type: 'updateState',
          payload: {
            activeKey: '1',
            modalType: 'add',
            currentItem: {}
          }
        })
        const { pathname, query } = location
        yield put(routerRedux.push({
          pathname,
          query: {
            ...query,
            page: 1,
            activeKey: '1'
          }
        }))
        yield put({
          type: 'shopeeCategory/updateState',
          payload: {
            lastProductName: undefined
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
      // Start - Upload Image
      const productImage = yield select(({ productstock }) => productstock.currentItem.productImage)
      let uploadedImage = []
      if (payload
        && payload.data
        && payload.data.productImage
        && payload.data.productImage.fileList
        && payload.data.productImage.fileList.length > 0
        && payload.data.productImage.fileList.length <= 5) {
        for (let key in payload.data.productImage.fileList) {
          const item = payload.data.productImage.fileList[key]
          if (item && item.originFileObj) {
            const formData = new FormData()
            formData.append('file', item.originFileObj)
            const responseUpload = yield call(uploadProductImage, formData)
            if (responseUpload.success && responseUpload.data && responseUpload.data.filename) {
              uploadedImage.push(responseUpload.data.filename)
            }
          } else if (item && item.name) {
            uploadedImage.push(item.name)
          }
        }
      } else if (payload
        && payload.data
        && payload.data.productImage
        && payload.data.productImage.fileList
        && payload.data.productImage.fileList.length > 0
        && payload.data.productImage.fileList.length > 5) {
        throw new Error('Cannot upload more than 5 image')
      } else if (productImage
        && productImage != null
        && productImage !== '["no_image.png"]'
        && productImage !== '"no_image.png"'
        && productImage !== 'no_image.png') {
        uploadedImage = JSON.parse(productImage)
      }
      // End - Upload Image

      const id = yield select(({ productstock }) => productstock.currentItem.productCode)
      const { location } = payload
      const newProductStock = { ...payload, id }
      if (uploadedImage && uploadedImage.length > 0) {
        newProductStock.data.productImage = uploadedImage
      } else {
        newProductStock.data.productImage = '["no_image.png"]'
      }
      const data = yield call(edit, newProductStock)
      if (data.success) {
        if (payload.reset) {
          payload.reset()
        }
        success('Stock Product has been saved')
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {},
            activeKey: '1'
          }
        })
        const { pathname, query } = location
        yield put(routerRedux.push({
          pathname,
          query: {
            ...query,
            page: 1,
            activeKey: '1'
          }
        }))
        yield put({
          type: 'shopeeCategory/updateState',
          payload: {
            lastProductName: undefined
          }
        })
        yield put({ type: 'query', payload: { stockQuery: true } })
      } else {
        let current = Object.assign({}, payload.id, payload.data)
        yield put({
          type: 'updateState',
          payload: {
            currentItem: current
          }
        })
        yield put({
          type: 'shopeeCategory/updateState',
          payload: {
            lastProductName: undefined
          }
        })
        throw data
      }
    }
  },

  reducers: {

    SuccessTransNo (state, action) {
      return { ...state, lastTrans: action.payload }
    },

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

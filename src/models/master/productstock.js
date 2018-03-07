import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import { query, add, edit, remove } from '../../services/master/productstock'
import { pageModel } from './../common'

const success = () => {
  message.success('Stock Product has been saved')
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
    show: 1,
    newItem: false,
    showModal: false,
    stickerQty: 1,
    logo: '',
    showModalProduct: false,
    modalProductType: '',
    listDummy: [],
    listUpdateDummy: [],
    auto: [],
    dummy: [],
    listPrintSelectedStock: [],
    listPrintAllStock: [],
    updateDummy: [],
    listSticker: [],
    selectedSticker: {},
    period: [],
    showPDFModal: false
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/master/product/stock') {
          dispatch({
            type: 'updateState',
            payload: {
              newItem: false,
              activeKey: '0',
              listSticker: []
            }
          })
          dispatch({ type: 'queryAuto' })
          dispatch({ type: 'queryAllStock', payload: { type: 'all' } })
        }
      })
    }
  },

  effects: {
    * queryAuto ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data) {
        yield put({
          type: 'querySuccessAuto',
          payload: data.data
        })
        const dataDummy = data.data.map(x => x.productName)
        yield put({
          type: 'updateState',
          payload: {
            dummy: dataDummy
          }
        })
      }
    },

    * queryUpdateAuto ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data) {
        yield put({
          type: 'querySuccessUpdateAuto',
          payload: data.data
        })
        const dataDummy = data.data.map(x => x.productName)
        yield put({
          type: 'updateState',
          payload: {
            updateDummy: dataDummy
          }
        })
      }
    },

    * queryAllStock ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            listPrintAllStock: data.data
          }
        })
      }
    },

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data) {
        if ((payload.q === undefined && payload.pageSize === undefined) || payload.q) {
          const listData = yield call(query, { pageSize: data.total })
          if (listData.success) {
            yield put({
              type: 'updateState',
              payload: {
                listPrintSelectedStock: listData.data
              }
            })
          }
        }
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

    * add ({ payload }, { call, put }) {
      const data = yield call(add, { id: payload.id, data: payload.data })
      if (data.success) {
        // yield put({ type: 'query' })
        success()
        yield put({ type: 'updateState', payload: { newItem: true } })
      } else {
        throw data
      }
    },

    * edit ({ payload }, { select, call, put }) {
      const id = yield select(({ productstock }) => productstock.currentItem.productCode)
      const newProductStock = { ...payload, id }
      const data = yield call(edit, newProductStock)
      if (data.success) {
        // yield put({ type: 'query' })
        success()
        yield put({ type: 'updateState', payload: { newItem: true, modalType: 'add', currentItem: {} } })
      } else {
        yield put({ type: 'updateState', payload: { modalType: 'edit' } })
        throw data
      }
    }
  },

  reducers: {

    switchIsChecked (state, { payload }) {
      return { ...state, isChecked: !state.isChecked, display: payload }
    },

    querySuccessAuto (state, { payload }) {
      return { ...state, listDummy: payload }
    },

    querySuccessUpdateAuto (state, { payload }) {
      return { ...state, listUpdateDummy: payload }
    },

    changeTab (state, { payload }) {
      return { ...state, ...payload }
    },

    resetItem (state, { payload }) {
      return { ...state, ...payload }
    },

    resetProductStockList (state) {
      return { ...state, list: [], listPrintSelectedStock: [], pagination: { total: 0 } }
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
    }

  }
})

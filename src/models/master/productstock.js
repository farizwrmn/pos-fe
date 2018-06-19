import modelExtend from 'dva-model-extend'
import { message, Modal } from 'antd'
import { routerRedux } from 'dva/router'
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
    showModal: false,
    showModalProduct: false,
    modalProductType: '',
    listPrintAllStock: [],
    listItem: [],
    listSticker: [],
    update: false,
    selectedSticker: {},
    period: [],
    showPDFModal: false,
    mode: '',
    changed: false,
    stockLoading: false
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { activeKey, ...other } = location.query
        const { pathname } = location
        if (pathname === '/master/product/stock') {
          // if (!activeKey) {
          //   dispatch(routerRedux.push({
          //     pathname,
          //     query: {
          //       activeKey: '0'
          //     }
          //   }))
          // }
          if (activeKey === '1') {
            dispatch({
              type: 'query',
              payload: other
            })
          }
          dispatch({
            type: 'updateState',
            payload: {
              changed: false,
              activeKey: activeKey || '0',
              listSticker: [],
              listItem: []
            }
          })
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

    * queryAllStock ({ payload = {} }, { call, put }) {
      yield put({ type: 'showLoading' })
      const data = yield call(query, { type: payload.type })
      yield put({ type: 'hideLoading' })
      if (data.success) {
        if (payload.mode === 'pdf') {
          if (data.data.length > 500) {
            Modal.warning({
              title: 'Your Data is too many, please print out with using Excel'
            })
          }
        }
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
      const newProductStock = { ...payload, id }
      const data = yield call(edit, newProductStock)
      if (data.success) {
        success()
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
    }

  }
})

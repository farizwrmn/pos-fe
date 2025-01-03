import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import { routerRedux } from 'dva/router'
import { query as querySequence } from 'services/sequence'
import { query, add, edit, remove } from 'services/master/productbrand'
import { pageModel } from '../common'

const success = () => {
  message.success('Brand Product has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'productbrand',

  state: {
    currentItem: {},
    modalType: 'add',
    lastTrans: '',
    display: 'none',
    isChecked: false,
    selectedRowKeys: [],
    activeKey: '0',
    disable: '',
    listBrand: [],
    show: 1
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { activeKey } = location.query
        const { pathname } = location
        if (pathname === '/master/product/brand') {
          dispatch({ type: 'queryLastAdjust' })
          if (!activeKey) dispatch({ type: 'refreshView' })
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || '0'
            }
          })
          if (activeKey === '1') dispatch({ type: 'query' })
        } else if (
          pathname === '/marketing/promo'
          || pathname === '/stock'
          || pathname === '/tools/sellprice'
          || pathname === '/marketing/target'
          || pathname === '/transaction/procurement/order'
          || pathname === '/tools/transaction/sales'
          || pathname === '/stock-pkm'
          || pathname === '/tools/transaction/purchase'
          || pathname === '/master/product/stock/import'
        ) {
          dispatch({ type: 'query', payload: { type: 'all' } })
        } else if (pathname === '/inventory/transfer/out') {
          if (activeKey !== '1') {
            dispatch({ type: 'query', payload: { type: 'all' } })
          }
        }
      })
    }
  },

  effects: {

    * queryLastAdjust ({ payload = {} }, { call, put }) {
      const invoice = {
        seqCode: 'BR',
        type: 1,
        ...payload
      }
      const data = yield call(querySequence, invoice)
      const transNo = data.data
      yield put({ type: 'SuccessTransNo', payload: transNo })
    },

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data) {
        yield put({
          type: 'querySuccessBrand',
          payload: {
            listBrand: data.data,
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
      const { selectedRowKeys } = yield select(models => models.productbrand)
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
      const id = yield select(({ productbrand }) => productbrand.currentItem.brandCode)
      const newProductBrand = { ...payload, id }
      const data = yield call(edit, newProductBrand)
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

    SuccessTransNo (state, action) {
      return { ...state, lastTrans: action.payload }
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

    resetProductBrandList (state) {
      return { ...state, listBrand: [], pagination: { total: 0 || '' } }
    },

    querySuccessBrand (state, action) {
      const { listBrand, pagination } = action.payload
      return {
        ...state,
        listBrand,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },

    refreshView (state) {
      return {
        ...state,
        modalType: 'add',
        currentItem: {}
      }
    }

  }
})

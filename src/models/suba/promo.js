import modelExtend from 'dva-model-extend'
import { query, add, edit, remove } from '../../services/suba/promo'
import { query as queryProducts } from '../../services/master/productstock'
import { pageModel } from '../common'

export default modelExtend(pageModel, {
  namespace: 'subaPromo',

  state: {
    currentItem: {},
    productInformation: {},
    tmpProductData: [],
    list: [],
    listProduct: [],
    activeKey: '0',
    disable: '',
    modalProductVisible: true,
    advancedForm: true,
    modalType: 'add',
    modalEdit: { visible: false, item: {} },
    paginationProduct: {
      current: 1
    },
    pagination: {
      current: 1
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { activeKey, ...other } = location.query
        const { pathname } = location
        if (pathname === '/master/product/promo') {
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || '0'
            }
          })
          if (activeKey === '1') dispatch({ type: 'query', payload: other })
        }
      })
    }
  },

  effects: {
    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            list: data.data
          }
        })
      }
    },
    * queryProduct ({ payload = {} }, { call, put }) {
      const data = yield call(queryProducts, payload)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            listProduct: data.data,
            tmpProductData: data.data,
            paginationProduct: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total
            }
          }
        })
      } else {
        throw data
      }
    },
    * add ({ payload }, { call, put }) {
      const data = yield call(add, payload)
      if (data.success) {
        yield put({
          type: 'query'
        })
        yield put({
          type: 'app/query'
        })
      } else {
        const current = Object.assign({}, payload.id, payload.data)
        yield put({
          type: 'updateState',
          payload: {
            currentItem: { ...current, menuId: null }
          }
        })
        throw data
      }
    },

    * edit ({ payload }, { call, put }) {
      const data = yield call(edit, payload)
      if (data.success) {
        yield put({
          type: 'query'
        })
        yield put({
          type: 'updateState',
          payload: {
            currentItem: {},
            modalType: 'add'
          }
        })
        yield put({
          type: 'app/query'
        })
      } else {
        throw data
      }
    },

    * editDraggable ({ payload }, { call, put }) {
      const data = yield call(edit, payload)
      if (data.success) {
        yield put({
          type: 'query'
        })
        yield put({
          type: 'app/query'
        })
      } else {
        throw data
      }
    },

    * delete ({ payload }, { call, put }) {
      const data = yield call(remove, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            modalEdit: { visible: false, key: '', title: '' }
          }
        })
        yield put({
          type: 'query'
        })
        yield put({
          type: 'app/query'
        })
      } else {
        throw data
      }
    }
  },

  reducers: {
    updateState (state, { payload }) {
      return { ...state, ...payload }
    },
    onChooseProduct (state, action) {
      return { ...state, productInformation: action.payload }
    },
    querySuccess (state, action) {
      const { listProduct, tmpProductData, paginationProduct } = action.payload
      return {
        ...state,
        listProduct,
        tmpProductData,
        paginationProduct: {
          ...state.pagination,
          ...paginationProduct
        }
      }
    }
  }
})

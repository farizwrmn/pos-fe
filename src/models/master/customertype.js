import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import { routerRedux } from 'dva/router'
import * as customerTypeService from '../../services/master/customertype'
import { pageModel } from './../common'

const { query, querySellprice, add, edit, remove } = customerTypeService

const success = () => {
  message.success('Customer Type has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'customertype',

  state: {
    currentItem: {},
    modalType: 'add',
    display: 'none',
    isChecked: false,
    selectedRowKeys: [],
    activeKey: '0',
    disable: '',
    listType: [],
    listSellprice: [],
    show: 1
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { activeKey } = location.query
        const { pathname } = location
        if (pathname === '/master/customertype') {
          if (!activeKey) dispatch({ type: 'refreshView' })
          dispatch({ type: 'querySellprice' })
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || '0'
            }
          })
          if (activeKey === '1') dispatch({ type: 'query' })
        } else if (pathname === '/setting/configure') {
          dispatch({ type: 'querySellprice' })
        }
      })
    }
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data) {
        yield put({
          type: 'querySuccessType',
          payload: {
            listType: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    },

    * querySellprice ({ payload = {} }, { call, put }) {
      const data = yield call(querySellprice, payload)
      if (data) {
        yield put({
          type: 'querySuccessSellprice',
          payload: {
            listSellprice: data.data
          }
        })
      }
    },

    * delete ({ payload }, { call, put, select }) {
      const data = yield call(remove, { typeCode: payload })
      const { selectedRowKeys } = yield select(_ => _.customertype)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * add ({ payload }, { call, put }) {
      const data = yield call(add, payload)
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
        yield put({
          type: 'updateState',
          payload: {
            currentItem: payload
          }
        })
        throw data
      }
    },

    * edit ({ payload }, { select, call, put }) {
      const id = yield select(({ customertype }) => customertype.currentItem.id)
      const newCustomerType = { ...payload, id }
      const data = yield call(edit, newCustomerType)
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
        yield put({
          type: 'updateState',
          payload: {
            currentItem: payload
          }
        })
        throw data
      }
    }
  },

  reducers: {
    switchIsChecked (state, display) {
      display = (state.isChecked === true ? 'none' : 'block')
      return { ...state, isChecked: !state.isChecked, display }
    },

    changeTab (state, { payload }) {
      return { ...state, ...payload }
    },

    resetItem (state, { payload }) {
      return { ...state, ...payload }
    },

    resetCustomerTypeList (state) {
      return { ...state, listType: [], pagination: { total: 0 } }
    },

    querySuccessType (state, action) {
      const { listType, pagination } = action.payload
      return {
        ...state,
        listType,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },

    querySuccessSellprice (state, action) {
      const { listSellprice } = action.payload
      return { ...state, listSellprice }
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

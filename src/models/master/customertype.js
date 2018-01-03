import modelExtend from 'dva-model-extend'
import * as customerTypeService from '../../services/master/customertype'
import { pageModel } from './../common'
import { message } from 'antd'

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
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/master/customertype') {
          dispatch({
            type: 'querySellprice',
          })
          // const payload = location.query
          // dispatch({
          //   type: 'query',
          //   payload: {
          //     code: 'SELLPRICE',
          //   },
          // })
        }
      })
    },
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, { typeName: payload.typeName })
      if (data) {
        yield put({
          type: 'querySuccessType',
          payload: {
            listType: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total,
            },
          },
        })
      }
    },

    * querySellprice ({ payload = {} }, { call, put }) {
      const data = yield call(querySellprice, payload)
      if (data) {
        yield put({
          type: 'querySuccessSellprice',
          payload: {
            listSellprice: data.data,
          },
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
        yield put({ type: 'query' })
        success()
      } else {
        throw data
      }
    },

    * edit ({ payload }, { select, call, put }) {
      const id = yield select(({ customertype }) => customertype.currentItem.id)
      const newCustomerType = { ...payload, id }
      const data = yield call(edit, newCustomerType)
      if (data.success) {
        yield put({ type: 'query' })
        success()
      } else {
        throw data
      }
    },
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

    querySuccessType (state, action) {
      const { listType, pagination } = action.payload
      return { ...state,
        listType,
        pagination: {
          ...state.pagination,
          ...pagination,
        } }
    },

    querySuccessSellprice (state, action) {
      const { listSellprice } = action.payload
      return { ...state, listSellprice }
    },
  },
})

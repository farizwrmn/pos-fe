import modelExtend from 'dva-model-extend'
import { query, add, edit, remove } from '../../services/master/customer'
import { pageModel } from './../common'
import { message } from 'antd'

const success = () => {
  message.success('Customer has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'customer',

  state: {
    currentItem: {},
    dataCustomer: {},
    modalType: 'add',
    display: 'none',
    isChecked: false,
    selectedRowKeys: [],
    activeKey: '0',
    disable: '',
    searchText: '',
    listCustomer: [],
    show: 1,
    modalVisible: false,
    newItem: false,
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        switch (location.pathname) {
          case '/master/customerunit':
            dispatch({
              type: 'query',
            })
            break
          case '/report/customer/history':
            dispatch({
              type: 'query',
            })
            break
          case '/master/customer':
            dispatch({
              type: 'updateState',
              payload: {
                newItem: false,
                activeKey: '0',
              },
            })
            break
          default:
        }
      })
    },
  },

  effects: {

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
              total: data.total,
            },
          },
        })
      }
    },

    * querySearch ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data) {
        yield put({
          type: 'onSearch',
          payload: {
            list: payload.search === '' ? [] : data.data,
            search: payload.search,
          },
        })
      }
    },

    * delete ({ payload }, { call, put, select }) {
      const data = yield call(remove, { id: payload })
      const { selectedRowKeys } = yield select(_ => _.customer)
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
      const id = yield select(({ customer }) => customer.currentItem.memberCode)
      const newCustomer = { ...payload, id }
      const data = yield call(edit, newCustomer)
      if (data.success) {
        // yield put({ type: 'query' })
        success()
        yield put({ type: 'updateState', payload: { newItem: true } })
      } else {
        throw data
      }
    },
  },

  reducers: {

    querySuccess (state, action) {
      const { list, pagination } = action.payload
      return {
        ...state,
        list,
        listCustomer: list,
        dataCustomer: {},
        pagination: {
          ...state.pagination,
          ...pagination,
        },
      }
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

    resetCustomerList (state) {
      return { ...state, list: [], pagination: { total: 0 } }
    },

    onSearch (state, action) {
      const { data, search } = action.payload
      const reg = new RegExp(search, 'gi')
      let customerData
      if (search.length > 0) {
        customerData = data.map((record) => {
          const match = record.memberName.match(reg) || record.memberCode.match(reg) || record.address01.match(reg) || record.mobileNumber.match(reg)
          if (!match) {
            return null
          }
          return {
            ...record,
          }
        }).filter(record => !!record)
      } else {
        customerData = []
      }
      return { ...state, listCustomer: customerData }
    },

  },
})

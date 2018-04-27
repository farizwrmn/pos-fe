import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import { routerRedux } from 'dva/router'
import { query, add, edit, remove } from '../../services/master/customer'
import { query as queryMobile, activate } from '../../services/mobile/member'
import { query as querySequence, increase as increaseSequence } from '../../services/sequence'
import { pageModel } from './../common'

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
    modalMobile: false,
    listCustomer: [],
    show: 1,
    modalVisible: false,
    listPrintAllCustomer: [],
    showPDFModal: false,
    mode: '',
    changed: false,
    customerLoading: false,
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { activeKey, ...other } = location.query
        const { pathname } = location
        switch (pathname) {
          case '/master/customerunit':
            dispatch({ type: 'query' })
            dispatch({
              type: 'updateState',
              payload: {
                searchText: ''
              }
            })
            break
          case '/report/customer/history':
            dispatch({
              type: 'query'
            })
            dispatch({
              type: 'updateState',
              payload: {
                searchText: ''
              }
            })
            break
          case '/master/customer':
            if (!activeKey) {
              dispatch(routerRedux.push({
                pathname,
                query: {
                  activeKey: '0'
                }
              }))
            }
            if (activeKey === '1') {
              dispatch({
                type: 'query',
                payload: other
              })
            }
            dispatch({
              type: 'updateState',
              payload: {
                activeKey: activeKey || '0'
              }
            })
            break
          default:
        }
      })
    }
  },

  effects: {
    * queryAllCustomer ({ payload = {} }, { call, put }) {
      yield put({ type: 'showLoading' })
      const data = yield call(query, payload)
      yield put({ type: 'hideLoading' })
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listPrintAllCustomer: data.data
          }
        })
      }
    },

    * queryMember ({ payload = {} }, { call, put }) {
      const data = yield call(queryMobile, payload)
      if (data.success) {
        yield put({
          type: 'updateCurrentItem',
          payload: {
            currentItem: {
              memberCode: data.data.memberCardId,
              memberName: data.data.memberName,
              email: data.data.memberEmail,
              memberCodeDisable: true,
              memberNameDisable: true,
              emailDisable: true
            },
            modalMobile: false
          }
        })
      } else {
        throw data
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
              current: Number(data.page) || 1,
              pageSize: Number(data.pageSize) || 10,
              total: data.total
            }
          }
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
            search: payload.search
          }
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
      const seqDetail = {
        seqCode: 'CUST',
        type: 1 // storeId
      }
      if (payload.data.memberGetDefault) {
        const sequence = yield call(querySequence, seqDetail)
        payload.id = sequence.data
        payload.data.memberCode = sequence.data
        if (!sequence.success) throw sequence
      }
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
        const increase = yield call(increaseSequence, seqDetail)
        if (!increase.success) throw increase
      } else {
        const { memberCode, ...other } = payload.data
        let current = Object.assign({}, payload.id, other)
        yield put({
          type: 'updateState',
          payload: {
            currentItem: current
          }
        })
        throw data
      }
    },

    * activate ({ payload }, { call, put }) {
      const data = yield call(activate, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            dataCustomer: {}
          }
        })
        success()
      } else {
        throw data
      }
    },

    * edit ({ payload }, { select, call, put }) {
      const id = yield select(({ customer }) => customer.currentItem.memberCode)
      const newCustomer = { ...payload, id }
      const data = yield call(edit, newCustomer)
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
    showLoading (state) { return { ...state, customerLoading: true } },

    hideLoading (state) { return { ...state, customerLoading: false } },

    querySuccess (state, action) {
      const { list, pagination } = action.payload
      return {
        ...state,
        list,
        listCustomer: list,
        dataCustomer: {},
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },

    updateCurrentItem (state, { payload }) {
      const current = {
        ...state.currentItem,
        ...payload.currentItem
      }
      return {
        ...state, currentItem: current
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
            ...record
          }
        }).filter(record => !!record)
      } else {
        customerData = []
      }
      return { ...state, listCustomer: customerData }
    }

  }
})

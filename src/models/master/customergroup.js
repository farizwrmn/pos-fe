import modelExtend from 'dva-model-extend'
import * as customerGroupService from '../../services/master/customergroup'
import { pageModel } from './../common'
import { message } from 'antd'

const { query, add, edit, remove } = customerGroupService

const success = () => {
  message.success('Customer Group has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'customergroup',

  state: {
    currentItem: {},
    modalType: 'add',
    display: 'none',
    isChecked: false,
    selectedRowKeys: [],
    activeKey: '0',
    disable: '',
    listGroup: [],
    show: 1,
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/master/customergroup') {
          // const payload = location.query
          // dispatch({
          //   type: 'query',
          //   payload,
          // })
        }
      })
    },
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, { groupName: payload.groupName })
      if (data) {
        yield put({
          type: 'querySuccessGroup',
          payload: {
            listGroup: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total,
            },
          },
        })
      }
    },

    * delete ({ payload }, { call, put, select }) {
      const data = yield call(remove, { groupCode: payload })
      const { selectedRowKeys } = yield select(_ => _.customergroup)
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
      const id = yield select(({ customergroup }) => customergroup.currentItem.id)
      const newCustomerGroup = { ...payload, id }
      const data = yield call(edit, newCustomerGroup)
      if (data.success) {
        yield put({ type: 'query' })
        success()
      } else {
        throw data
      }
    },
  },

  reducers: {

    switchIsChecked (state, { payload }) {
      return { ...state, isChecked: !state.isChecked, display: payload }
    },

    changeTab (state, { payload }) {
      return { ...state, ...payload }
    },

    resetItem (state, { payload }) {
      return { ...state, ...payload }
    },

    resetCustomerGroupList (state) {
      return { ...state, listGroup: [], pagination: { total: 0 } }
    },

    querySuccessGroup (state, action) {
      const { listGroup, pagination } = action.payload
      return { ...state,
        listGroup,
        pagination: {
          ...state.pagination,
          ...pagination,
        } }
    },

  },
})

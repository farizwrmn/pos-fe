import modelExtend from 'dva-model-extend'
import { query, add, edit, remove } from '../services/customergroup'
import { pageModel } from './common'
import { config } from 'utils'

const { disableMultiSelect } = config

export default modelExtend(pageModel, {
  namespace: 'customergroup',

  state: {
    listGroup: [],
    currentItem: {},
    addItem: {},
    modalVisible: false,
    searchVisible: false,
    modalType: 'add',
    selectedRowKeys: [],
    disableMultiSelectCusGroup: disableMultiSelect,
    paginationCustomerGroup: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `Total ${total} Records`,
      current: 1,
      total: null,
    },
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/master/customergroup') {
          dispatch({
            type: 'query',
            payload: location.query,
          })
        }
      })
    },
  },

  effects: {

    *query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data) {
        yield put({
          type: 'querySuccessCustomerGroup',
          payload: {
            listGroup: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 5,
              total: data.total,
            },
          },
        })
      }
    },

    *'delete' ({ payload }, { call, put, select }) {
      const data = yield call(remove, { id: payload })
      const { selectedRowKeys } = yield select(_ => _.customergroup)
      if (data.success) {
        yield put({ type: 'CustomerGroup', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    *'deleteBatch' ({ payload }, { call, put }) {
      const data = yield call(remove, payload)
      if (data.success) {
        yield put({ type: 'CustomerGroup', payload: { selectedRowKeys: [] } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    *add ({ payload }, { call, put }) {
      const data = yield call(add, payload)
      if (data.success) {
        yield put({ type: 'modalHide' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    *edit ({ payload }, { select, call, put }) {
      const customergroupId = yield select(({ customergroup }) => customergroup.currentItem.groupCode)
      const newcustomergroup = { ...payload, customergroupId }
      const data = yield call(edit, newcustomergroup)
      if (data.success) {
        yield put({ type: 'modalHide' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },
  },
  *lovForCustomer ({ payload }, { call, put }) {
    const data = yield call(query, payload)
    if (data) {
      yield put({
        type: 'querySuccessCustomerGroup',
        payload: {
          listGroup: data.data,
          pagination: {
            current: Number(payload.page) || 1,
            pageSize: Number(payload.pageSize) || 5,
            total: data.total,
          },
        },
      })
    }
  },

  reducers: {

    querySuccessCustomerGroup (state, action) {
      const { listGroup, pagination } = action.payload
      return { ...state,
        listGroup,
        paginationCustomerGroup: {
          ...state.paginationCustomerGroup,
          ...pagination,
        } }
    },
    CustomerGroup (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    modalShow (state, { payload }) {
      return { ...state, ...payload, modalVisible: true, disabledItem: { id: false } }
    },
    modalHide (state) {
      return { ...state, modalVisible: false }
    },
    choosePrice (state, action) {
      return { ...state, ...action.payload, visiblePopoverGroup: false }
    },
    modalPopoverVisible (state, action) {
      return { ...state, ...action.payload, visiblePopoverGroup: true }
    },
    modalPopoverClose (state) {
      return { ...state, visiblePopoverGroup: false }
    },
    searchShow (state) {
      return { ...state, searchVisible: true }
    },
    searchHide (state) {
      return { ...state, searchVisible: false }
    },
    modalIsEmployeeChange (state, action) {
      return { ...state,
        ...action.payload,
        disabledItem: {
          id: (state.modalType !== 'add' ? !state.disabledItem.id : state.disabledItem.id),
          getEmployee: !state.disabledItem.getEmployee,
        },
      }
    },
  },
})

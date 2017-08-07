import modelExtend from 'dva-model-extend'
import { query, add, edit, remove } from '../services/users'
import { pageModel } from './common'

export default modelExtend(pageModel, {
  namespace: 'user',

  state: {
    list: [],
    currentItem: {},
    addItem: {},
    modalVisible: false,
    searchVisible: false,
    modalType: 'add',
    selectedRowKeys: [],
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/setting/user') {
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
          type: 'querySuccess',
          payload: {
            list: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 5,
              total: data.total,
            },
          },
        })
        yield put({ type: 'misc/lov', payload: { code: 'USERROLE' } })
        yield put({ type: 'employee/lovForUser' })
      }
    },

    *'delete' ({ payload }, { call, put, select }) {
      const data = yield call(remove, { id: payload })
      const { selectedRowKeys } = yield select(_ => _.user)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    *'deleteBatch' ({ payload }, { call, put }) {
      const data = yield call(remove, payload)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    *add ({ payload }, { call, put }) {
      const data = yield call(add, { id: payload.id, data: payload.data })
      if (data.success) {
        yield put({ type: 'modalHide' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    *edit ({ payload }, { select, call, put }) {
      const userId = yield select(({ user }) => user.currentItem.userId)
      const newUser = { ...payload, userId }
      const data = yield call(edit, newUser)
      if (data.success) {
        yield put({ type: 'modalHide' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

  },

  reducers: {

    querySuccess (state, action) {
      const { list, pagination } = action.payload
      return { ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination,
        } }
    },
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    modalShow (state, { payload }) {
      return { ...state, ...payload, modalVisible: true, disabledItem: { userId: false } }
    },
    modalHide (state) {
      return { ...state, modalVisible: false }
    },
    chooseEmployee (state, action) {
      return { ...state, ...action.payload, visiblePopover: false }
    },
    modalPopoverVisible (state, action) {
      return { ...state, ...action.payload, visiblePopover: true }
    },
    modalPopoverClose (state) {
      return { ...state, visiblePopover: false }
    },
    searchShow (state) {
      return { ...state, searchVisible: true }
    },
    searchHide (state) {
      return { ...state, searchVisible: false }
    },
    modalIsEmployeeChange (state, action) {
      return { ...state, ...action.payload,
        disabledItem:{
          userId: (state.modalType !== 'add' ? !state.disabledItem.userId : state.disabledItem.userId),
          getEmployee: !state.disabledItem.getEmployee,
        },
      }
    },
  },
})

import modelExtend from 'dva-model-extend'
import { query, queryMode, add, edit, remove } from '../services/misc'
import { pageModel } from './common'

export default modelExtend(pageModel, {
  namespace: 'misc',

  state: {
    list: [],
    listLov: {},
    code: '',
    currentItem: {},
    addItem: {},
    modalVisible: false,
    searchVisible: false,
    modalType: 'add',
    selectedRowKeys: []
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/setting/misc') {
          dispatch({
            type: 'query',
            payload: location.query
          })
        } else if (location.pathname === '/transaction/pos/payment') {
          dispatch({ type: 'misc/lovFullCode', payload: { code: 'PAYMENT' } })
        }
      })
    }
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
              pageSize: Number(payload.pageSize) || 5,
              total: data.total
            }
          }
        })
      }
    },

    * lov ({ payload }, { call, put }) {
      const miscCode = payload.code
      const data = yield call(queryMode, { code: miscCode, fields: 'miscName,miscDesc', for: 'user' })
      if (data.success) {
        const dataLov = data.data
        const totalData = data.data.length
        yield put({
          type: 'querySuccessLov',
          payload: {
            code: miscCode.toLowerCase('miscCode'),
            listLov: { [miscCode.toLowerCase('miscCode')]: dataLov },
            pagination: {
              total: totalData
            }
          }
        })
      } else {
        console.log('not success')
      }
    },

    * lovFullCode ({ payload }, { call, put }) {
      const miscCode = payload.code
      const data = yield call(queryMode, { code: miscCode, fields: 'miscName,miscDesc,miscVariable' })
      if (data.success) {
        const dataLov = data.data
        const totalData = data.data.length
        yield put({
          type: 'querySuccessLov',
          payload: {
            code: miscCode.toLowerCase('miscCode'),
            listLov: { [miscCode.toLowerCase('miscCode')]: dataLov },
            pagination: {
              total: totalData
            }
          }
        })
      } else {
        console.log('not success')
      }
    },

    * delete ({ payload }, { call, put, select }) {
      const data = yield call(remove, payload)
      const { selectedRowKeys } = yield select(_ => _.misc)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * deleteBatch ({ payload }, { call, put }) {
      const data = yield call(remove, payload)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * add ({ payload }, { call, put }) {
      const data = yield call(add, { id: payload.id, name: payload.name, data: payload.data })
      if (data.success) {
        yield put({ type: 'modalHide' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * edit ({ payload }, { select, call, put }) {
      const miscCode = yield select(({ misc }) => misc.currentItem.miscCode)
      const newMisc = { ...payload, miscCode }
      const data = yield call(edit, newMisc)
      if (data.success) {
        yield put({ type: 'modalHide' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    }

  },

  reducers: {

    querySuccess (state, action) {
      const { list, pagination } = action.payload
      return { ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination
        } }
    },
    querySuccessLov (state, action) {
      const { listLov, pagination, code } = action.payload
      return { ...state,
        code,
        listLov,
        pagination: {
          ...state.pagination,
          ...pagination
        } }
    },
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload
      }
    },
    modalShow (state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
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
    }
  }
})

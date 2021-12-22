import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { message } from 'antd'
import { query, queryOption, editOption, add, edit, remove } from 'services/finance/pettyCash'
import { query as querySequence } from '../../services/sequence'
import { pageModel } from '../common'

const success = () => {
  message.success('Petty cash has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'pettyCash',

  state: {
    currentItem: {},
    modalType: 'add',
    sequence: '',
    activeKey: '0',
    list: [],
    listItem: [],
    listOption: [],
    modalItemVisible: false,
    currentListItem: [],
    modalItemType: 'add',
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
        if (pathname === '/balance/finance/petty-cash') {
          dispatch({ type: 'querySequence' })
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || '0'
            }
          })
          dispatch({
            type: 'queryOption'
          })
          if (activeKey === '1') dispatch({ type: 'query', payload: other })
        }
      })
    }
  },

  effects: {
    * querySequence (payload, { call, put }) {
      const seqDetail = {
        seqCode: 'PTC',
        type: 1
      }
      const sequence = yield call(querySequence, seqDetail)
      if (sequence.success) {
        yield put({ type: 'updateState', payload: { sequence: sequence.data } })
      }
    },

    * query ({ payload = {} }, { call, put }) {
      payload.order = '-id'
      const data = yield call(query, payload)
      if (data.success) {
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

    * delete ({ payload }, { call, put }) {
      const data = yield call(remove, payload)
      if (data.success) {
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * queryOption (payload, { call, put }) {
      const data = yield call(queryOption, { type: 'all' })
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listOption: data.data
          }
        })
      } else {
        throw data
      }
    },

    * editOption ({ payload = {} }, { call, put }) {
      const data = yield call(editOption, payload)
      if (data.success) {
        success()
        yield put({
          type: 'queryOption'
        })
      } else {
        throw data
      }
    },

    * add ({ payload }, { call, put }) {
      const data = yield call(add, payload.data)
      if (data.success) {
        success()
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {},
            listItem: [],
            currentListItem: {}
          }
        })
        yield put({ type: 'querySequence' })
        yield put({
          type: 'query'
        })
        if (payload.reset) {
          payload.reset()
        }
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
      const id = yield select(({ pettyCash }) => pettyCash.currentItem.id)
      const newCounter = { ...payload.data, id }
      const data = yield call(edit, newCounter)
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
        if (payload.reset) {
          payload.reset()
        }
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
    querySuccess (state, action) {
      const { list, pagination } = action.payload
      return {
        ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },

    updateState (state, { payload }) {
      return { ...state, ...payload }
    },

    changeTab (state, { payload }) {
      const { key } = payload
      return {
        ...state,
        activeKey: key,
        modalType: 'add',
        currentItem: {}
      }
    },

    editItem (state, { payload }) {
      const { item } = payload
      return {
        ...state,
        modalType: 'edit',
        activeKey: '0',
        currentItem: item
      }
    }
  }
})

import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { message } from 'antd'
import { query, queryBox, add, edit, remove } from 'services/consignment/rentRequest'
import { getConsignmentId } from 'utils/lstorage'
import { pageModel } from '../common'

const success = () => {
  message.success('Rent Request has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'rentRequest',

  state: {
    currentItem: {},
    modalType: 'add',
    rentRequest: [],
    listBox: [],
    listOutlet: [],
    consignmentId: getConsignmentId(),
    activeKey: '0',
    list: [],
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
        if (pathname === '/integration/consignment/rent-request') {
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || '0'
            }
          })
          if (activeKey === '1') {
            dispatch({ type: 'query', payload: other })
          } else {
            dispatch({ type: 'queryBox', payload: other })
          }
        }
      })
    }
  },

  effects: {
    * queryBox ({ payload = {} }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          listBox: [],
          listOutlet: []
        }
      })
      const consignmentId = getConsignmentId()
      if (consignmentId) {
        payload.outlet_id = consignmentId
        const data = yield call(queryBox, payload)
        if (data.success) {
          yield put({
            type: 'updateState',
            payload: {
              listBox: data.listBox,
              listOutlet: data.listOutlet
            }
          })
        } else {
          throw data
        }
      }
    },

    * query ({ payload = {} }, { call, put }) {
      const consignmentId = getConsignmentId()
      if (consignmentId) {
        payload.outlet_id = consignmentId
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
      } else {
        yield put({
          type: 'querySuccess',
          payload: {
            list: [],
            pagination: {
              current: 1,
              pageSize: 10,
              total: 0
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

    * add ({ payload }, { call, put }) {
      const data = yield call(add, payload.data)
      if (data.success) {
        success()
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {}
          }
        })
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
      const id = yield select(({ rentRequest }) => rentRequest.currentItem.id)
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

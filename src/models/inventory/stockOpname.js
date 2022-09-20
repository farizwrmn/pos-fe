import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { message } from 'antd'
import { lstorage } from 'utils'
import { query, queryActive, queryById, addBatch, updateFinishLine, queryListDetail, add, edit, remove } from 'services/inventory/stockOpname'
import { query as queryEmployee } from 'services/master/employee'
import { pageModel } from 'models/common'
import pathToRegexp from 'path-to-regexp'

const success = () => {
  message.success('Stock Opname has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'stockOpname',

  state: {
    currentItem: {},
    modalType: 'add',
    activeKey: '0',
    list: [],
    listEmployee: [],
    listActive: [],
    listDetail: [],
    listDetailFinish: [],
    detailData: {},
    modalEditVisible: false,
    modalEditItem: {},
    detailPagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    },
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
        const match = pathToRegexp('/stock-opname/:id').exec(location.pathname)
        if (match) {
          dispatch({
            type: 'queryDetail',
            payload: {
              id: decodeURIComponent(match[1]),
              storeId: lstorage.getCurrentUserStore()
            }
          })
        }
        if (pathname === '/stock-opname') {
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || '0'
            }
          })
          if (activeKey === '1') {
            dispatch({ type: 'query', payload: other })
          } else {
            dispatch({
              type: 'queryActive'
            })
          }
        }
      })
    }
  },

  effects: {

    * finishLine ({ payload = {} }, { select, call, put }) {
      const listDetail = yield select(({ stockOpname }) => stockOpname.listDetail)
      yield put({
        type: 'updateState',
        payload: {
          modalEditItem: {},
          modalEditVisible: false,
          listDetail: listDetail.filter(filtered => filtered.productCode !== payload.productCode)
        }
      })
      const response = yield call(updateFinishLine, payload)
      if (response.success) {
        yield put({
          type: 'queryDetailData',
          payload: {
            page: 1,
            pageSize: 40,
            status: ['DIFF', 'CONFLICT', 'MISS'],
            order: '-updatedAt',
            transId: payload.transId,
            storeId: payload.storeId,
            batchId: payload.batchId
          }
        })
      } else {
        throw response
      }
    },

    * queryDetail ({ payload = {} }, { call, put }) {
      const data = yield call(queryById, payload)
      if (data.success && data.data) {
        const { detail, ...other } = data.data
        yield put({ type: 'queryEmployee' })
        yield put({
          type: 'updateState',
          payload: {
            detailData: other
          }
        })
        if (other && other.activeBatch && other.activeBatch.id) {
          yield put({
            type: 'queryDetailData',
            payload: {
              page: 1,
              pageSize: 40,
              status: ['DIFF', 'CONFLICT', 'MISS'],
              order: '-updatedAt',
              transId: other.id,
              storeId: other.storeId,
              batchId: other.activeBatch.id
            }
          })
        }
      } else {
        throw data
      }
    },

    * queryEmployee ({ payload = {} }, { call, put }) {
      const data = yield call(queryEmployee, payload)
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            listEmployee: data.data
          }
        })
      } else {
        throw data
      }
    },


    * insertBatchTwo ({ payload = {} }, { call, put }) {
      const response = yield call(addBatch, {
        transId: payload.transId,
        storeId: payload.storeId,
        userId: payload.userId,
        batchNumber: payload.batchNumber,
        description: payload.description
      })
      if (response && response.success) {
        yield put({
          type: 'queryDetail',
          payload: {
            id: payload.transId,
            storeId: lstorage.getCurrentUserStore()
          }
        })
        if (payload.reset) {
          payload.reset()
        }
      } else {
        throw response
      }
    },

    * queryDetailData ({ payload = {} }, { call, put }) {
      const data = yield call(queryListDetail, payload)
      if (data.success && data.data) {
        yield put({
          type: 'updateState',
          payload: {
            listDetail: data.data.map((item, index) => ({ ...item, no: index + 1 })),
            detailPagination: {
              current: Number(data.page) || 1,
              pageSize: Number(data.pageSize) || 10,
              total: data.total,
              showSizeChanger: true,
              showQuickJumper: true
            }
          }
        })
        yield put({
          type: 'queryDetailDataFinished',
          payload
        })
      } else {
        throw data
      }
    },

    * queryDetailDataFinished ({ payload = {} }, { call, put }) {
      const data = yield call(queryListDetail, { ...payload, status: 'FINISHED' })
      if (data.success && data.data) {
        yield put({
          type: 'updateState',
          payload: {
            listDetailFinish: data.data.map((item, index) => ({ ...item, no: index + 1 }))
          }
        })
      } else {
        throw data
      }
    },

    * query ({ payload = {} }, { call, put }) {
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

    * queryActive ({ payload = {} }, { call, put }) {
      const data = yield call(queryActive, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listActive: data.data
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
          type: 'queryActive'
        })
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
      const id = yield select(({ stockOpname }) => stockOpname.currentItem.id)
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

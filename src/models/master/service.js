import modelExtend from 'dva-model-extend'
import { message, Modal } from 'antd'
import { routerRedux } from 'dva/router'
import { query, queryServiceType, add, edit, remove } from '../../services/master/service'
import { pageModel } from './../common'

const success = () => {
  message.success('Service has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'service',

  state: {
    currentItem: {},
    modalType: 'add',
    display: 'none',
    isChecked: false,
    selectedRowKeys: [],
    activeKey: '0',
    disable: '',
    listServiceType: [],
    show: 1,
    listPrintAllService: [],
    showPDFModal: false,
    mode: '',
    changed: false,
    serviceLoading: false
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { activeKey, ...other } = location.query
        const { pathname } = location
        switch (pathname) {
          case '/master/service':
            if (!activeKey) dispatch({ type: 'refreshView' })
            if (activeKey === '1') dispatch({ type: 'query', payload: other })
            dispatch({ type: 'queryServiceType' })
            dispatch({
              type: 'updateState',
              payload: {
                activeKey: activeKey || '0'
              }
            })
            break
          case '/report/service/history':
            dispatch({
              type: 'queryServiceType'
            })
            dispatch({
              type: 'query'
            })
            break
          case '/report/customer/history':
            dispatch({
              type: 'queryServiceType'
            })
            break
          case '/report/pos/analyst':
            dispatch({
              type: 'queryServiceType'
            })
            break
          default:
        }
      })
    }
  },

  effects: {
    * checkLengthOfData ({ payload = {} }, { call, put }) {
      yield put({ type: 'showLoading' })
      const data = yield call(query, payload)
      yield put({ type: 'hideLoading' })
      if (data.success) {
        if (data.data.length > 0) {
          Modal.warning({
            title: 'Your Data is too many, please print out with using Excel'
          })
        } else {
          yield put({ type: 'queryAllService', payload: { type: 'all' } })
        }
      }
    },

    * queryAllService ({ payload = {} }, { call, put }) {
      yield put({ type: 'showLoading' })
      const data = yield call(query, payload)
      yield put({ type: 'hideLoading' })
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listPrintAllService: data.data,
            changed: true
          }
        })
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
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    },

    * queryServiceType ({ payload = {} }, { call, put }) {
      const data = yield call(queryServiceType, payload)
      console.log(data)
      if (data) {
        yield put({
          type: 'querySuccessServiceType',
          payload: {
            listServiceType: data.data
          }
        })
      }
    },

    * delete ({ payload }, { call, put, select }) {
      const data = yield call(remove, { id: payload })
      const { selectedRowKeys } = yield select(_ => _.service)
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
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {}
          }
        })
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
    },

    * edit ({ payload }, { select, call, put }) {
      const id = yield select(({ service }) => service.currentItem.serviceCode)
      const newService = { ...payload, id }
      const data = yield call(edit, newService)
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
    showLoading (state) { return { ...state, serviceLoading: true } },

    hideLoading (state) { return { ...state, serviceLoading: false } },

    resetServiceList (state) {
      return { ...state, list: [], pagination: { total: 0 } }
    },

    querySuccessServiceType (state, action) {
      const { listServiceType } = action.payload
      return { ...state, listServiceType }
    },

    refreshView (state) {
      return {
        ...state,
        modalType: 'add',
        currentItem: {}
      }
    }

  }
})

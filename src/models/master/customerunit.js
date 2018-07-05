import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import { routerRedux } from 'dva/router'
import {
  queryUnits,
  addUnit,
  removeUnit,
  editUnit,
  queryCarBrands,
  queryCarModels,
  queryCarTypes
} from '../../services/master/customer'
import { pageModel } from './../common'

const success = () => {
  message.success('Customer Unit has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'customerunit',

  state: {
    currentItem: {},
    modalType: 'add',
    display: 'none',
    isChecked: false,
    selectedRowKeys: [],
    activeKey: '0',
    disable: '',
    listUnit: [],
    customerInfo: {},
    listBrand: [],
    listModel: [],
    listType: [],
    selected: { brand: {}, model: {}, type: {} }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { activeKey } = location.query
        const { pathname } = location
        dispatch({
          type: 'updateState',
          payload: {
            customerInfo: {}
          }
        })
        if (pathname === '/master/customerunit') {
          if (!activeKey) dispatch({ type: 'refreshView' })
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || '0'
            }
          })
        }
      })
    }
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(queryUnits, { memberCode: payload.code })
      if (data) {
        yield put({
          type: 'querySuccessUnit',
          payload: {
            listUnit: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    },

    * add ({ payload }, { call, put }) {
      const data = yield call(addUnit, payload)
      if (data.success) {
        // yield put({ type: 'query' })
        success()
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {},
            customerInfo: {}
          }
        })
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

    * delete ({ payload }, { call, put, select }) {
      const data = yield call(removeUnit, { id: payload.policeNo, memberCode: payload.member.id })
      const { selectedRowKeys } = yield select(_ => _.customer)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'query', payload: { code: payload.member.memberCode } })
      } else {
        throw data
      }
    },

    * edit ({ payload }, { select, call, put }) {
      const id = yield select(({ customerunit }) => customerunit.currentItem.policeNo)
      const code = yield select(({ customerunit }) => customerunit.currentItem.memberCode)
      const newCustomerUnit = { ...payload, id, code }
      const data = yield call(editUnit, newCustomerUnit)
      if (data.success) {
        yield put({ type: 'query', payload: { code } })
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

    * queryCarBrands ({ payload = {} }, { call, put }) {
      const data = yield call(queryCarBrands, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listBrand: data.data
          }
        })
      } else {
        throw data
      }
    },

    * queryCarModels ({ payload = {} }, { call, put }) {
      const data = yield call(queryCarModels, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listModel: data.data
          }
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            listModel: []
          }
        })
      }
    },

    * queryCarTypes ({ payload = {} }, { call, put }) {
      const data = yield call(queryCarTypes, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listType: data.data
          }
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            listType: data.data
          }
        })
      }
    }

  },

  reducers: {
    switchIsChecked (state, display) {
      display = (state.isChecked === true ? 'none' : 'block')
      return { ...state, isChecked: !state.isChecked, display }
    },

    changeTab (state, action) {
      const { pagination } = action.payload
      return { ...state, ...action.payload, pagination: { ...state.pagination, ...pagination } }
    },

    resetItem (state, { payload }) {
      return { ...state, ...payload }
    },

    resetUnit (state) {
      return { ...state, listUnit: [], pagination: { current: '', pageSize: '', total: '' } }
    },

    querySuccessUnit (state, action) {
      const { listUnit, pagination } = action.payload
      return {
        ...state,
        listUnit,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },

    refreshView (state) {
      return {
        ...state,
        modalType: 'add',
        currentItem: {},
        customerInfo: {}
      }
    }

  }
})

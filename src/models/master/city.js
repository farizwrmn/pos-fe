import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import { query, add, edit, remove } from '../../services/city'
import { pageModel } from './../common'

const success = () => {
  message.success('City has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'city',

  state: {
    currentItem: {},
    modalType: 'add',
    display: 'none',
    isChecked: false,
    selectedRowKeys: [],
    activeKey: '0',
    disable: '',
    listCity: [],
    show: 1,
    newItem: false
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/master/city') {
          dispatch({
            type: 'updateState',
            payload: {
              newItem: false,
              activeKey: '0'
            }
          })
        }
      })
    }
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data) {
        yield put({
          type: 'querySuccessCity',
          payload: {
            listCity: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    },

    * delete ({ payload }, { call, put, select }) {
      const data = yield call(remove, { id: payload })
      const { selectedRowKeys } = yield select(_ => _.city)
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
        yield put({ type: 'updateState', payload: { newItem: true } })
      } else {
        throw data
      }
    },

    * edit ({ payload }, { select, call, put }) {
      const id = yield select(({ city }) => city.currentItem.cityCode)
      const newCity = { ...payload, id }
      const data = yield call(edit, newCity)
      if (data.success) {
        yield put({ type: 'query' })
        success()
        yield put({ type: 'updateState', payload: { newItem: true } })
      } else {
        throw data
      }
    }
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
    resetCityList (state) {
      return { ...state, listCity: [], pagination: { total: 0 } }
    },

    querySuccessCity (state, action) {
      const { listCity, pagination } = action.payload
      return { ...state,
        listCity,
        pagination: {
          ...state.pagination,
          ...pagination
        } }
    }

  }
})

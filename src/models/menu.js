import modelExtend from 'dva-model-extend'
import { query, add, show, edit, remove } from '../services/menu'
import { pageModel } from './common'

export default modelExtend(pageModel, {
  namespace: 'menu',

  state: {
    currentItem: {},
    listMenu: [],
    modalType: 'add',
    modalEdit: { visible: false, key: '', title: '' }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/setting/menu') {
          dispatch({ type: 'query' })
        }
      })
    }
  },

  effects: {
    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listMenu: data.data
          }
        })
      }
    },

    * add ({ payload }, { call, put }) {
      const data = yield call(add, payload)
      if (data.success) {
        setInterval(() => window.location.reload(), 500)
      } else {
        const current = Object.assign({}, payload.id, payload.data)
        yield put({
          type: 'updateState',
          payload: {
            currentItem: current
          }
        })
        throw data
      }
    },

    * show ({ payload }, { call, put }) {
      const data = yield call(show, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: data.data,
            modalType: 'edit',
            modalEdit: {
              visible: false,
              key: '',
              title: ''
            }
          }
        })
      }
    },

    * edit ({ payload }, { call }) {
      const data = yield call(edit, payload)
      if (data.success) {
        setInterval(() => window.location.reload(), 500)
      } else {
        throw data
      }
    },

    * editDraggable ({ payload }, { call }) {
      const data = yield call(edit, payload)
      if (data.success) {
        setInterval(() => window.location.reload(), 500)
      } else {
        throw data
      }
    },

    * delete ({ payload }, { call }) {
      const data = yield call(remove, payload)
      if (data.success) {
        setInterval(() => window.location.reload(), 500)
      } else {
        throw data
      }
    }
  },

  reducers: {}
})

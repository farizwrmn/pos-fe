import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { message } from 'antd'
import FormData from 'form-data'
import { query, add, edit, upload, remove } from '../../services/marketing/cms'
import { pageModel } from './../common'

const success = () => {
  message.success('Content has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'cms',

  state: {
    currentItem: {},
    modalType: 'add',
    activeKey: '0',
    listCms: [],
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
        if (pathname === '/marketing/cms') {
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || '0'
            }
          })
          if (activeKey === '1') dispatch({ type: 'query', payload: other })
        }
      })
    }
  },

  effects: {
    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data.success) {
        yield put({
          type: 'querySuccessCms',
          payload: {
            listCms: data.data,
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

    * add ({ payload }, { call, put }) {
      const formData = new FormData()
      formData.append('files', payload.files)
      const uploadData = yield call(upload, formData)
      if (uploadData.success) {
        payload.image = uploadData.data.url
        const data = yield call(add, payload)
        if (data.success) {
          success()
          yield put({
            type: 'updateState',
            payload: {
              modalType: 'add',
              currentItem: {},
              activeKey: 1
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
      } else {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: payload
          }
        })
        throw uploadData
      }
    },

    * edit ({ payload }, { select, call, put }) {
      let uploadData = {
        success: true
      }
      console.log('payload.files', payload.files)
      if (payload.files) {
        const formData = new FormData()
        formData.append('files', payload.files)
        uploadData = yield call(upload, formData)
        payload.image = uploadData.success ? uploadData.data.url : null
      }
      if (uploadData.success) {
        const id = yield select(({ cms }) => cms.currentItem.id)
        const newCounter = { ...payload, id }
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
        } else {
          yield put({
            type: 'updateState',
            payload: {
              currentItem: payload
            }
          })
          throw data
        }
      } else {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: payload
          }
        })
        throw uploadData
      }
    }
  },

  reducers: {
    querySuccessCms (state, action) {
      const { listCms, pagination } = action.payload
      return {
        ...state,
        listCms,
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

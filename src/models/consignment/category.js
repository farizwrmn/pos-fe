import { message } from 'antd'
import modelExtend from 'dva-model-extend'
import { query, queryAdd, queryEdit } from 'services/consignment/category'
import {
  query as subQuery,
  queryAdd as subQueryAdd,
  queryEdit as subQueryEdit
} from 'services/consignment/subCategory'
import { pageModel } from '../common'


export default modelExtend(pageModel, {
  namespace: 'consignmentCategory',

  state: {
    formType: 'add',
    modalForm: false,
    modalType: false,
    activeKey: '0',
    detailActiveKey: '0',
    list: [],
    subList: [],
    currentItem: {},
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    }
  },

  subscriptions: {
    setup ({ history, dispatch }) {
      history.listen((location) => {
        console.log('location.pathname', location.pathname)
        if (location.pathname === '/integration/consignment/vendor'
          || location.pathname === '/integration/consignment/product'
          || location.pathname === '/integration/consignment/product-category') {
          dispatch({
            type: 'query',
            payload: {}
          })
          dispatch({
            type: 'subQuery',
            payload: {}
          })
        }
      })
    }
  },

  effects: {
    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            ...payload
          }
        })
      }
    },
    * subQuery ({ payload = {} }, { call, put }) {
      const data = yield call(subQuery)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            subList: data.data,
            ...payload
          }
        })
      }
    },
    * queryAdd ({ payload = {} }, { call, put }) {
      const response = yield call(queryAdd, payload)
      console.log('response', response)
      if (response && response.meta && response.meta.success) {
        message.success('Berhasil')
        yield put({
          type: 'query',
          payload: {
            currentItem: {},
            modalForm: false
          }
        })
      } else {
        message.error('Gagal')
      }
    },
    * queryEdit ({ payload = {} }, { call, put }) {
      const response = yield call(queryEdit, payload)
      if (response && response.meta && response.meta.success) {
        message.success('Berhasil')
        yield put({
          type: 'query',
          payload: {
            currentItem: {},
            modalForm: false
          }
        })
      } else {
        message.error(`Gagal : ${response.message}`)
      }
    },
    * subQueryAdd ({ payload = {} }, { call, put }) {
      console.log('payload', payload)
      const data = yield call(subQueryAdd, payload)
      if (data.success) {
        yield put({
          type: 'subQuery',
          payload: {
            currentItem: {},
            modalForm: false
          }
        })
      }
    },
    * subQueryEdit ({ payload = {} }, { call, put }) {
      console.log('payload', payload)
      const data = yield call(subQueryEdit, payload)
      if (data.success) {
        yield put({
          type: 'subQuery',
          payload: {
            currentItem: {},
            modalForm: false
          }
        })
      }
    }
  },

  reducers: {
    querySuccess (state, action) {
      return {
        ...state,
        ...action.payload
      }
    },
    updateState (state, action) {
      return {
        ...state,
        ...action.payload
      }
    }
  }
})

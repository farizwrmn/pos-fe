import modelExtend from 'dva-model-extend'
import { query } from '../services/sequence'
import { pageModel } from './common'

export default modelExtend(pageModel, {
  namespace: 'sequence',

  state: {
    listFormat: []
  },
  subscriptions: {

  },
  effects: {
    * query ({ payload }, { call, put }) {
      const data = yield call(query, payload)
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            listFormat: data.data
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
    }
  }
})

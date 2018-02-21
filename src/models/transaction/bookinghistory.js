import modelExtend from 'dva-model-extend'
import pathToRegexp from 'path-to-regexp'
import { queryHistory } from '../../services/transaction/booking'
import { pageModel } from '../common'

export default modelExtend(pageModel, {
  namespace: 'bookinghistory',
  state: {
    listHistory: []
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/transaction/booking/:id/history').exec(pathname)
        if (match) {
          dispatch({ type: 'query', payload: match[1] })
        }
      })
    }
  },

  effects: {
    * query ({ payload = {} }, { call, put }) {
      const data = yield call(queryHistory, payload)
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            listHistory: data.data
          }
        })
      }
    }
  },

  reducers: {

    querySuccess (state, action) {
      const { listHistory } = action.payload
      return {
        ...state,
        listHistory
      }
    }
  }
})

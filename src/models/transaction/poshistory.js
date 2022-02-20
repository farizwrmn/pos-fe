import moment from 'moment'
import { prefix } from 'utils/config.main'
import { queryOut } from '../../services/poshistory'

const infoStore = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : null

export default {
  namespace: 'poshistory',

  state: {
    period: moment(infoStore.startPeriod).format('YYYY-MM')
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const infoStore = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : null
        console.log('infoStore', infoStore)
        if (location.pathname === '/inventory/transfer/out') {
          dispatch({
            type: 'query',
            payload: {
              start: infoStore.startPeriod,
              end: infoStore.endPeriod
            }
          })
        }
      })
    }
  },

  effects: {
    * query ({ payload = {} }, { call, put }) {
      const data = yield call(queryOut, payload)
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
    }
  }

}

import { message } from 'antd'
import modelExtend from 'dva-model-extend'
import moment from 'moment'
import { queryPeriod, queryLast, queryAdd, querySendEmail } from 'services/consignment/cutOff'
import { pageModel } from '../common'


export default modelExtend(pageModel, {
  namespace: 'consignmentCutOffPeriodReport',

  state: {
    activeKey: '0',
    lastCutOffDate: null,
    list: [],
    pagination: {
      current: 1
    }
  },

  subscriptions: {
    setup ({ history, dispatch }) {
      history.listen((location) => {
        if (location.pathname === '/integration/consignment/cut-off-period-report') {
          dispatch({
            type: 'query',
            payload: {}
          })
          dispatch({
            type: 'queryLast',
            payload: {}
          })
          if (location.query && location.query.activeKey) {
            dispatch({
              type: 'updateState',
              payload: {
                activeKey: location.query.activeKey
              }
            })
          } else {
            dispatch({
              type: 'updateState',
              payload: {
                activeKey: '0'
              }
            })
          }
        }
      })
    }
  },

  effects: {
    * query ({ payload = {} }, { call, put }) {
      const params = {
        page: payload.page || 1
      }
      const response = yield call(queryPeriod, params)
      yield put({
        type: 'querySuccess',
        payload: {
          list: response.data.data,
          pagination: {
            total: response.data.count,
            current: params.page
          },
          ...payload
        }
      })
    },
    * queryLast ({ payload = {} }, { call, put }) {
      const response = yield call(queryLast)
      const date = moment(response.data.period).format('DD MMM YYYY')
      yield put({ type: 'querySuccess', payload: { lastCutOffDate: date, ...payload } })
    },
    * querySendEmail ({ payload = {} }, { call, put }) {
      const params = {
        period: payload.record.period
      }
      const response = yield call(querySendEmail, params)
      if (response && response.success) {
        message.success('Berhasil! Email akan di jadwalkan sesuai dengan sistem!')
        yield put({
          type: 'query',
          payload: {}
        })
      } else {
        throw response
      }
    },
    * queryAdd ({ payload = {} }, { call, put }) {
      const response = yield call(queryAdd, payload)
      if (response && response.meta && response.meta.success) {
        message.success('Berhasil')
        yield put({ type: 'query', payload: {} })
      } else {
        message.error(`Gagal: ${response.message}`)
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

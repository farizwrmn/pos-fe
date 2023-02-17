import { message } from 'antd'
import modelExtend from 'dva-model-extend'
import moment from 'moment'
import { queryPeriod, queryLast, queryAdd } from 'services/consignment/cutOff'
import { setCutOffReadyForEmail } from 'services/consignment/cutOffDetail'
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
        }
        if (location.query && location.query.activeKey) {
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: location.query.activeKey
            }
          })
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
        outletId: payload.record.outlet_id,
        cutOffId: payload.record.id
      }
      const response = yield call(setCutOffReadyForEmail, params)
      const date = moment(response.data.period).format('DD MMM YYYY')
      yield put({ type: 'querySuccess', payload: { lastCutOffDate: date, ...payload } })
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

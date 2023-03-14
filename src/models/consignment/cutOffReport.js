import { message } from 'antd'
import modelExtend from 'dva-model-extend'
import {
  queryPeriodList,
  query
} from 'services/consignment/cutOff'
import { setCutOffReadyForEmail } from 'services/consignment/cutOffDetail'
import { getConsignmentId } from 'utils/lstorage'
import { pageModel } from '../common'


export default modelExtend(pageModel, {
  namespace: 'consignmentCutOffReport',

  state: {
    period: null,
    activeKey: '0',
    list: [],
    consignmentId: getConsignmentId(),
    periodList: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    }
  },

  subscriptions: {
    setup ({ history, dispatch }) {
      history.listen((location) => {
        if (location.pathname === '/integration/consignment/cut-off-report') {
          dispatch({
            type: 'queryPeriodList',
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
      const consignmentId = getConsignmentId()
      if (consignmentId) {
        const params = {
          period: payload.period,
          outletId: consignmentId
        }
        const response = yield call(query, params)
        yield put({ type: 'querySuccess', payload: { list: response.data, ...payload } })
      } else {
        yield put({ type: 'querySuccess', payload: { list: [], ...payload } })
      }
    },
    * queryPeriodList ({ payload = {} }, { call, put }) {
      const response = yield call(queryPeriodList)
      yield put({ type: 'querySuccess', payload: { periodList: response.data, ...payload } })
    },
    * setCutOffReadyForEmail ({ payload = {} }, { call, put }) {
      const params = {
        id: payload.id
      }
      const response = yield call(setCutOffReadyForEmail, params)
      if (response && response.meta && response.meta.success) {
        message.success('Berhasil Kirim E-mail')
        yield put({ type: 'querySuccess', payload: { periodList: response.data, ...payload } })
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

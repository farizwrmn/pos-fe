import modelExtend from 'dva-model-extend'
import moment from 'moment'
import { lstorage } from 'utils'
import { routerRedux } from 'dva/router'
import { pageModel } from './common'
import {
  queryTransactionDetail, queryHeader, updateStatusToZero, updateStatusToTwo,
  updateNextServiceAndCustomerSatisfaction, updatePending, updateAcceptOffering,
  updateDenyOffering, queryHeaderById
} from './../services/followUp'
import { getDateTime } from '../services/setting/time'

export default modelExtend(pageModel, {
  namespace: 'followup',

  state: {
    currentItem: {},
    currentFeedback: {},
    activeKey: '1',
    listFollowUpHeader: [],
    listTransactionDetail: [],
    itemFeedbacks: [],
    modalFeedback: false,
    start: moment().startOf('month').format('YYYY-MM-DD'),
    end: moment().format('YYYY-MM-DD'),
    q: '',
    modalFilter: false,
    modalPending: false,
    modalAcceptOffer: false,
    modalDenyOffer: false,
    currentStep: 0
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { start, end, q, status, ...other } = location.query
        if (location.pathname === '/monitor/followup') {
          let field = 'posId,memberName,gender,transDate,transNo,status,storeName'
          dispatch({
            type: 'updateState',
            payload: {
              q: null
            }
          })
          let transDate = [(start || moment().startOf('month').format('YYYY-MM-DD')), (end || moment().format('YYYY-MM-DD'))]
          let payload = { ...other, transDate }
          if (q && q !== '') {
            payload = { ...other, q }
            dispatch({
              type: 'updateState',
              payload: {
                start: null,
                end: null,
                q
              }
            })
          } else {
            dispatch({
              type: 'getDate',
              payload: { start, end }
            })
          }
          if (status) {
            payload = Object.assign(payload, { status })
          } else {
            payload = Object.assign(payload, { status: [0, 2, 3, 4] })
          }
          dispatch({ type: 'queryHeader', payload: Object.assign(payload, { field }) })
        }
      })
    }
  },

  effects: {
    * getDate ({ payload }, { call, put }) {
      const time = yield call(getDateTime, { id: 'date' })
      if (time.success) {
        yield put({
          type: 'updateState',
          payload: {
            start: payload.start || moment().startOf('month').format('YYYY-MM-DD'),
            end: payload.end || moment(time.data).format('YYYY-MM-DD')
          }
        })
      }
    },

    * queryHeader ({ payload }, { call, put }) {
      const data = yield call(queryHeader, { ...payload })
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listFollowUpHeader: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total
            }
          }
        })
      } else {
        throw data
      }
    },

    * queryHeaderById ({ payload }, { call, put }) {
      const data = yield call(queryHeaderById, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: { currentItem: data.data }
        })
      } else {
        throw data
      }
    },

    * updateStatusToZero ({ payload }, { call, put }) {
      const data = yield call(updateStatusToZero, payload)
      if (data.success) {
        const details = yield call(queryTransactionDetail, { id: data.data.transNo, storeId: data.data.storeId })
        const { pathname } = location
        yield put(routerRedux.push({
          pathname
        }))
        yield put({
          type: 'updateState',
          payload: {
            currentStep: 0,
            activeKey: '0',
            currentItem: data.data,
            listTransactionDetail: details.pos
          }
        })
      } else {
        throw data
      }
    },

    * updateStatusToTwo ({ payload }, { call, put }) {
      const data = yield call(updateStatusToTwo, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            currentStep: 1
          }
        })
      } else {
        throw data
      }
    },

    * updateNextServiceAndCustomerSatisfaction ({ payload }, { call, put }) {
      const data = yield call(updateNextServiceAndCustomerSatisfaction, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            currentStep: 2,
            currentFeedback: {},
            itemFeedbacks: [],
            listTransactionDetail: []
          }
        })
        yield put({
          type: 'promo/query',
          payload: {
            storeId: lstorage.getCurrentUserStore()
          }
        })
        yield put({
          type: 'productstock/query',
          payload: {
            page: 1,
            pageSize: 5,
            order: '-createdAt'
          }
        })
        yield put({
          type: 'service/query',
          payload: {
            page: 1,
            pageSize: 5,
            order: '-createdAt'
          }
        })
      } else {
        throw data
      }
    },

    * updatePending ({ payload }, { call, put }) {
      const data = yield call(updatePending, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            modalPending: false,
            currentStep: 0,
            currentItem: {},
            activeKey: '1',
            currentFeedback: {},
            itemFeedbacks: [],
            listTransactionDetail: []
          }
        })
      } else {
        throw data
      }
    },

    * updateAcceptOffering ({ payload }, { call, put }) {
      const data = yield call(updateAcceptOffering, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            modalAcceptOffer: false,
            currentStep: 3
          }
        })
        yield put({
          type: 'queryHeaderById',
          payload: {
            id: payload.id
          }
        })
      } else {
        throw data
      }
    },

    * updateDenyOffering ({ payload }, { call, put }) {
      const data = yield call(updateDenyOffering, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            modalDenyOffer: false,
            currentStep: 3
          }
        })
        yield put({
          type: 'queryHeaderById',
          payload: {
            id: payload.id
          }
        })
      } else {
        throw data
      }
    }
  },

  reducers: {
    saveFeedback (state, { payload }) {
      let arr = state.itemFeedbacks
      if (payload.customerSatisfaction !== '' && !_.isEmpty(payload.customerSatisfaction)) {
        let available = arr.find(x => x.posDetailId === payload.posDetailId)
        if (available) {
          arr = arr.filter(x => x.posDetailId !== payload.posDetailId)
        }
        arr.push(payload)
      }
      return { ...state, itemFeedbacks: arr, modalFeedback: false }
    },

    nextStep (state, { payload }) {
      let currentStep = state.currentStep + 1
      if (payload !== undefined) {
        currentStep = payload
      }
      return { ...state, currentStep }
    }
  }
})

import modelExtend from 'dva-model-extend'
import { query } from '../services/history'
import moment from 'moment'
import { pageModel } from './common'
import { config } from 'utils'

const { prefix } = config
const infoStore = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : null

export default modelExtend(pageModel, {
  namespace: 'history',

  state: {
    modalVisible: false,
    policeNoId: '485',
    listTrans: [],
    memberCode: 'MDN001000016',
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/master/city') {
          // dispatch({
          //   type: 'query',
          //   payload: {
          //     memberCode: 'MDN001000016',
          //     from: moment(infoStore.startPeriod).format('YYYY-MM-DD'),
          //     to: moment(infoStore.endPeriod).format('YYYY-MM-DD'),
          //   },
          // })
        }
      })
    },
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            listTrans: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 5,
              total: data.total,
            },
          },
        })
      }
    },

    * queryTrans ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      const policeNoId = payload.policeNoId
      if (data) {
        yield put({
          type: 'querySuccessTrans',
          payload: {
            listTrans: data.data,
            policeNoId,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 5,
              total: data.total,
            },
          },
        })
      }
    },
  },

  reducers: {

    querySuccess (state, action) {
      const {
        list,
        listTrans,
        pagination,
      } = action.payload
      return {
        ...state,
        listTrans,
        list,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
      }
    },

    querySuccessTrans (state, action) {
      const {
        listTrans,
        policeNoId,
        pagination,
      } = action.payload
      return {
        ...state,
        listTrans,
        policeNoId,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
      }
    },

  },
})

/**
 * Created by Veirry on 18/09/2017.
 */
import { query as queryReport, queryMechanic } from '../../services/report/service'
import { queryMode as miscQuery } from '../../services/misc'
import { parse } from 'qs'
import { routerRedux } from 'dva/router'

export default {
  namespace: 'serviceReport',

  state: {
    list: [],
    listMechanic: [],
    listService: [],
    fromDate: '',
    toDate: '',
    productCode: 'ALL TYPE',
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `Total ${total} Records`,
      current: 1,
      total: null,
    },
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        switch (location.pathname) {
          case '/report/service/summary':
            dispatch({
              type: 'setListNull',
            })
            break
          case '/report/service/history':
            dispatch({
              type: 'updateState',
              payload: {
                listService: [],
                listMechanic: [],
                fromDate: '',
                toDate: '',
              },
            })
            break
          default:
        }
      })
    },
  },
  effects: {
    * query ({ payload }, { call, put }) {
      let data = []
      if (payload) {
        data = yield call(queryReport, payload)
      } else {
        data = yield call(queryReport)
      }
      yield put({
        type: 'querySuccess',
        payload: {
          list: data.data,
          pagination: {
            total: data.total,
          },
        },
      })
    },
    * queryService ({ payload }, { call, put }) {
      let data = []
      if (payload) {
        data = yield call(queryMechanic, payload)
        yield put({
          type: 'updateState',
          payload: {
            listService: data.data,
          },
        })
      }
    },
    * queryMechanic ({ payload }, { call, put }) {
      let data = []
      if (payload) {
        data = yield call(queryMechanic, payload)
        yield put({
          type: 'querySuccessMechanic',
          payload: {
            listMechanic: data.data,
            fromDate: payload.from,
            toDate: payload.to,
            pagination: {
              total: data.total,
            },
          },
        })
      }
    },
  },
  reducers: {
    querySuccess (state, action) {
      const { list, pagination, tmpList, fromDate, toDate } = action.payload

      return { ...state,
        list,
        tmpList,
        fromDate,
        toDate,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
      }
    },
    querySuccessMechanic (state, action) {
      const { listMechanic, pagination, fromDate, toDate } = action.payload

      return { ...state,
        listMechanic,
        fromDate,
        toDate,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
      }
    },
    updateState (state, { payload }) {
      return { ...state, ...payload }
    },
    setDate (state, action) {
      return { ...state, fromDate: action.payload.from, toDate: action.payload.to }
    },
    setListNull (state) {
      return { ...state, list: [] }
    },
  },
}

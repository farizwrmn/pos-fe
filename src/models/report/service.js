/**
 * Created by Veirry on 18/09/2017.
 */
import moment from 'moment'
import { query as queryReport, queryDetail, queryMechanic } from '../../services/report/service'

export default {
  namespace: 'serviceReport',

  state: {
    list: [],
    listMechanic: [],
    listService: [],
    fromDate: moment().format('YYYY-MM-DD'),
    toDate: moment().format('YYYY-MM-DD'),
    productCode: 'ALL TYPE',
    activeKey: '1',
    filterModalVisible: false,
    modalFilterServiceByTrans: false,
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `Total ${total} Records`,
      current: 1,
      total: null
    }
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        switch (location.pathname) {
          case '/report/service/summary':
            {
              const { activeKey } = location.query
              dispatch({
                type: 'setListNull'
              })
              dispatch({
                type: 'updateState',
                payload: {
                  activeKey: activeKey || '1'
                }
              })
            }
            break
          case '/report/service/history':
            dispatch({
              type: 'setListNull'
            })
            break
          default:
        }
      })
    }
  },
  effects: {
    * query ({ payload }, { call, put }) {
      const data = yield call(queryReport, payload)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            pagination: {
              total: data.total
            }
          }
        })
        yield put({
          type: 'updateState',
          payload: {
            fromDate: payload.from,
            toDate: payload.to,
            filterModalVisible: false
          }
        })
      } else {
        throw data
      }
    },
    * queryDetail ({ payload }, { call, put }) {
      const data = yield call(queryDetail, payload)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            pagination: {
              total: data.total
            }
          }
        })
        yield put({
          type: 'updateState',
          payload: {
            fromDate: payload.from,
            toDate: payload.to,
            filterModalVisible: false
          }
        })
      } else {
        throw data
      }
    },
    * queryService ({ payload }, { call, put }) {
      const data = yield call(queryMechanic, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listService: data.data
          }
        })
      } else {
        throw data
      }
    },
    * queryMechanic ({ payload }, { call, put }) {
      const data = yield call(queryMechanic, payload)
      if (data.success) {
        yield put({
          type: 'querySuccessMechanic',
          payload: {
            list: data.data,
            listMechanic: data.data,
            fromDate: payload.from,
            toDate: payload.to,
            pagination: {
              total: data.total
            }
          }
        })
        yield put({
          type: 'updateState',
          payload: {
            fromDate: payload.from,
            toDate: payload.to
          }
        })
      } else {
        throw data
      }
    }
  },
  reducers: {
    querySuccess (state, action) {
      const { list, pagination, tmpList, fromDate, toDate } = action.payload

      return {
        ...state,
        list,
        tmpList,
        fromDate,
        toDate,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },
    querySuccessMechanic (state, action) {
      const { list, listMechanic, pagination, fromDate, toDate } = action.payload

      return {
        ...state,
        list,
        listMechanic,
        fromDate,
        toDate,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },
    updateState (state, { payload }) {
      return { ...state, ...payload }
    },
    setDate (state, action) {
      return { ...state, fromDate: action.payload.from, toDate: action.payload.to }
    },
    setListNull (state) {
      return { ...state, list: [], listMechanic: [] }
    }
  }
}

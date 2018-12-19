/**
 * Created by Veirry on 25/04/2018.
 */
import {
  queryHourly,
  queryHour,
  queryTarget
} from '../../services/report/marketing'

export default {
  namespace: 'marketingReport',

  state: {
    listTrans: [],
    fromDate: '',
    toDate: '',
    activeKey: '1',
    transTime: {},
    selectedBrand: [],
    tableHeader: [],
    filterModalVisible: false,
    byCategory: 1,
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
        const { activeKey } = location.query
        if (location.pathname === '/report/pos/monthly') {
          dispatch({
            type: 'setListNull'
          })
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || '1'
            }
          })
        } else if (location.pathname === '/report/marketing/target') {
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || '1',
              listTrans: [],
              fromDate: '',
              toDate: ''
            }
          })
        } else {
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: '1'
            }
          })
        }
      })
    }
  },
  effects: {
    * queryHourly ({ payload = {} }, { call, put }) {
      const { fromDate, toDate, ...other } = payload
      const data = yield call(queryHourly, other)
      if (data.success) {
        const transTime = {
          ...payload
        }
        yield put({
          type: 'querySuccessHourly',
          payload: {
            listTrans: data.data,
            pagination: {
              total: data.total
            },
            transTime,
            fromDate,
            toDate
          }
        })
      } else {
        throw data
      }
    },
    * queryHour ({ payload = {} }, { call, put }) {
      const { fromDate, toDate, ...other } = payload
      const data = yield call(queryHour, other)
      if (data.success) {
        const transTime = {
          ...payload
        }
        yield put({
          type: 'querySuccessHourly',
          payload: {
            listTrans: data.data,
            pagination: {
              total: data.total
            },
            transTime,
            fromDate,
            toDate
          }
        })
      } else {
        throw data
      }
    },
    * queryTarget ({ payload = {} }, { call, put }) {
      const data = yield call(queryTarget, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listTrans: data.data,
            pagination: {
              total: data.total
            },
            fromDate: payload.from,
            toDate: payload.to,
            byCategory: Number(payload.byCategory)
          }
        })
      } else {
        throw data
      }
    }
  },
  reducers: {
    querySuccessHourly (state, action) {
      const { listTrans, pagination, transTime, tmpList, fromDate, toDate } = action.payload

      return {
        ...state,
        transTime,
        listTrans,
        fromDate,
        toDate,
        tmpList,
        filterModalVisible: false,
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
      return { ...state, fromDate: action.payload.from, toDate: action.payload.to, ...action.payload }
    },
    setListNull (state) {
      return {
        ...state,
        list: [],
        listTrans: [],
        listDaily: [],
        listPOS: [],
        listPOSDetail: [],
        listPOSCompareSvsI: [],
        diffDay: 0,
        selectedBrand: [],
        tableHeader: [],
        pagination: {
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: total => `Total ${total} Records`,
          current: 1,
          total: null
        }
      }
    }
  }
}

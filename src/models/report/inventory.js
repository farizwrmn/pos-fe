/**
 * Created by Veirry on 04/10/2017.
 */
import { query as queryReport, queryTrans, queryAll, queryTransCancel, queryPosDaily } from '../../services/report/pos'
import { queryInventoryTransferOut } from '../../services/report/inventory'

export default {
  namespace: 'inventoryReport',

  state: {
    list: [],
    listTrans: [],
    listDaily: [],
    listInventoryTO: [],
    period: '',
    fromDate: '',
    toDate: '',
    category: 'ALL CATEGORY',
    brand: 'ALL BRAND',
    productCode: 'ALL TYPE',
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
        if (location.pathname === '/report/inventory/transfer') {
          dispatch({
            type: 'setListNull'
          })
        }
      })
    }
  },
  effects: {
    * queryPart ({ payload }, { call, put }) {
      let data = []
      if (payload) {
        data = yield call(queryReport, payload)
      } else {
        data = yield call(queryReport)
      }
      yield put({
        type: 'querySuccessPart',
        payload: {
          list: data.data,
          pagination: {
            total: data.total
          }
        }
      })
    },
    * queryTransAll ({ payload }, { call, put }) {
      const data = yield call(queryAll, payload)
      yield put({
        type: 'querySuccessTrans',
        payload: {
          listTrans: data.data,
          fromDate: payload.from,
          toDate: payload.to,
          pagination: {
            total: data.total
          }
        }
      })
    },
    * queryTransCancel ({ payload }, { call, put }) {
      const data = yield call(queryTransCancel, payload)
      yield put({
        type: 'querySuccessTrans',
        payload: {
          listTrans: data.data,
          fromDate: payload.from,
          toDate: payload.to,
          pagination: {
            total: data.total
          }
        }
      })
    },
    * queryTrans ({ payload }, { call, put }) {
      let data = []
      if (payload) {
        data = yield call(queryTrans, payload)
      } else {
        data = yield call(queryTrans)
      }
      yield put({
        type: 'querySuccessTrans',
        payload: {
          listTrans: data.data,
          pagination: {
            total: data.total
          },
          fromDate: payload.from,
          toDate: payload.to
        }
      })
    },
    * queryDaily ({ payload }, { call, put }) {
      let data = yield call(queryPosDaily, payload)
      yield put({
        type: 'querySuccessDaily',
        payload: {
          listDaily: data.data,
          fromDate: payload.from,
          toDate: payload.to,
          ...payload
        }
      })
    },
    * queryInventoryTransferOut ({ payload }, { call, put }) {
      console.log(payload)
      const data = yield call(queryInventoryTransferOut, payload)
      console.log(data)
      yield put({
        type: 'querySuccessInventoryTO',
        payload: {
          listInventoryTO: data.data,
          pagination: {
            current: Number(data.page) || 1,
            pageSize: Number(data.pageSize) || 10,
            total: data.total
          }
        }
      })
    }
  },
  reducers: {
    querySuccessPart (state, action) {
      const { list, tmpList } = action.payload

      return {
        ...state,
        list,
        tmpList
      }
    },

    updateState (state, { payload }) {
      return {
        ...state,
        ...payload
      }
    },

    querySuccessInventoryTO (state, { payload }) {
      const { listInventoryTO, pagination } = payload

      return {
        ...state,
        listInventoryTO,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },
    querySuccessDaily (state, action) {
      return {
        ...state,
        ...action.payload
      }
    },
    querySuccessTrans (state, action) {
      const { listTrans, pagination, tmpList, fromDate, toDate } = action.payload

      return {
        ...state,
        listTrans,
        fromDate,
        toDate,
        tmpList,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
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
        listInventoryTO: [],
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

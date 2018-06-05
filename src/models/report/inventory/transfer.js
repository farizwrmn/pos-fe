/**
 * Created by Veirry on 04/10/2017.
 */
import { lstorage } from 'utils'
import { query as queryReport, queryTrans, queryAll, queryTransCancel, queryPosDaily } from '../../../services/report/pos'
import { queryInventoryTransferIn, queryInventoryTransferOut, queryInventoryInTransit } from '../../../services/report/inventory'

export default {
  namespace: 'inventoryReport',

  state: {
    list: [],
    listTrans: [],
    listDaily: [],
    listInventoryTransfer: [],
    activeKey: '0',
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
        const { activeKey } = location.query
        if (location.pathname === '/report/inventory/transfer' && location.query.activeKey && location.query.period && location.query.year) {
          switch (location.query.activeKey) {
            case '0':
              dispatch({
                type: 'queryInventoryTransferIn',
                payload: {
                  period: location.query.period,
                  year: location.query.year
                }
              })
              break
            case '1':
              dispatch({
                type: 'queryInventoryTransferOut',
                payload: {
                  period: location.query.period,
                  year: location.query.year
                }
              })
              break
            case '2':
              dispatch({
                type: 'queryInventoryInTransit',
                payload: {
                  status: 0,
                  active: 1,
                  storeId: lstorage.getCurrentUserStore(),
                  period: location.query.period,
                  year: location.query.year
                }
              })
              break
            case '3':
              dispatch({
                type: 'queryInventoryInTransit',
                payload: {
                  status: 0,
                  active: 1,
                  storeIdReceiver: lstorage.getCurrentUserStore(),
                  period: location.query.period,
                  year: location.query.year
                }
              })
              break
            default:
          }
          const period = `${location.query.year}-${location.query.period}`
          dispatch({
            type: 'updateState',
            payload: {
              period,
              activeKey: activeKey || '0'
            }
          })
        } else if (location.pathname === '/report/inventory/transfer' && location.query.activeKey && !(location.query.period && location.query.year)) {
          switch (location.query.activeKey) {
            case '2':
              dispatch({
                type: 'queryInventoryInTransit',
                payload: {
                  status: 0,
                  active: 1,
                  storeId: lstorage.getCurrentUserStore()
                }
              })
              break
            case '3':
              dispatch({
                type: 'queryInventoryInTransit',
                payload: {
                  status: 0,
                  active: 1,
                  storeIdReceiver: lstorage.getCurrentUserStore()
                }
              })
              break
            default:
          }
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || '0'
            }
          })
        } else {
          dispatch({
            type: 'setListNull'
          })
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || '0'
            }
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
    * queryInventoryTransferIn ({ payload }, { call, put }) {
      const data = yield call(queryInventoryTransferIn, payload)
      yield put({
        type: 'querySuccessInventory',
        payload: {
          listInventoryTransfer: data.data,
          pagination: {
            current: Number(data.page) || 1,
            pageSize: Number(data.pageSize) || 10,
            total: data.total
          }
        }
      })
    },
    * queryInventoryTransferOut ({ payload }, { call, put }) {
      const data = yield call(queryInventoryTransferOut, payload)
      yield put({
        type: 'querySuccessInventory',
        payload: {
          listInventoryTransfer: data.data,
          pagination: {
            current: Number(data.page) || 1,
            pageSize: Number(data.pageSize) || 10,
            total: data.total
          }
        }
      })
    },
    * queryInventoryInTransit ({ payload }, { call, put }) {
      const data = yield call(queryInventoryInTransit, payload)
      yield put({
        type: 'querySuccessInventory',
        payload: {
          listInventoryTransfer: data.data,
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

    querySuccessInventory (state, { payload }) {
      const { listInventoryTransfer, pagination } = payload

      return {
        ...state,
        listInventoryTransfer,
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
        listInventoryTransfer: [],
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

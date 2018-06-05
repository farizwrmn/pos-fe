/**
 * Created by Veirry on 04/10/2017.
 */
import { querySellpriceReport } from '../../../services/report/inventory/sellprice'

export default {
  namespace: 'sellpriceReport',

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
        if (location.pathname === '/report/inventory/sellprice' && location.query.activeKey && location.query.period && location.query.year) {
          switch (location.query.activeKey) {
            case '0':
              dispatch({
                type: 'querySellpriceReport',
                payload: {
                  period: location.query.period,
                  year: location.query.year,
                  transNo: location.query.transNo !== '' ? location.query.transNo : null
                }
              })
              // if (location.query.transNo) {
              //   dispatch({
              //     type: 'querySellpriceReport',
              //     payload: {
              //       period: location.query.period,
              //       year: location.query.year
              //     }
              //   })
              // } else {
              //   dispatch({
              //     type: 'querySellpriceReport',
              //     payload: {
              //       period: location.query.period,
              //       year: location.query.year,
              //       transNo: location.query.transNo
              //     }
              //   })
              // }
              break
            case '1':
              dispatch({
                type: 'querySellpriceReport',
                payload: {
                  period: location.query.period,
                  year: location.query.year,
                  type: 'detail',
                  transNo: location.query.transNo !== '' ? location.query.transNo : null
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
        } else if (location.pathname === '/report/inventory/sellprice' && location.query.activeKey && !(location.query.period && location.query.year)) {
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
    * querySellpriceReport ({ payload }, { call, put }) {
      const data = yield call(querySellpriceReport, payload)
      if (data.success) {
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
      } else {
        throw data
      }
    }
  },
  reducers: {
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

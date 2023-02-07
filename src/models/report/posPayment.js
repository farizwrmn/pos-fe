/**
 * Created by Veirry on 07/07/2020.
 */
import { queryPosPayment } from 'services/report/posPayment'
import { queryLovBalance } from 'services/balance/balance'
import moment from 'moment'

export default {
  namespace: 'posPaymentReport',

  state: {
    listTrans: [],
    listBalance: [],
    from: '',
    to: '',
    date: null,
    activeKey: '1',
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
        if (location.pathname === '/report/pos/payment') {
          dispatch({
            type: 'setListNull'
          })
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: '1'
            }
          })
          dispatch({
            type: 'query',
            payload: location.query
          })
          dispatch({
            type: 'dashboard/querySalesCategory',
            payload: {
              from: location.query.from || moment().format('YYYY-MM-DD'),
              to: location.query.to || moment().format('YYYY-MM-DD')
            }
          })
          dispatch({
            type: 'queryLovBalance',
            payload: {
              from: location.query.from,
              to: location.query.to
            }
          })
        }
      })
    }
  },
  effects: {
    * queryLovBalance ({ payload = {} }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          listBalance: []
        }
      })
      const data = yield call(queryLovBalance, payload)
      if (data && data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listBalance: data.data
          }
        })
      } else {
        throw data
      }
    },
    * query ({ payload }, { call, put }) {
      const data = yield call(queryPosPayment, payload)
      yield put({
        type: 'querySuccessTrans',
        payload: {
          listTrans: data.data,
          pagination: {
            total: data.total
          },
          from: payload.from,
          to: payload.to
        }
      })
    }
  },
  reducers: {
    querySuccessTrans (state, action) {
      const { listTrans, pagination, tmpList, from, to } = action.payload

      return {
        ...state,
        listTrans,
        from,
        to,
        tmpList,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },
    updateState (state, { payload }) {
      return { ...state, ...payload }
    },
    setListNull (state) {
      return {
        ...state,
        listTrans: [],
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

/**
 * Created by Veirry on 07/07/2020.
 */
import { queryPosPayment } from 'services/report/posPayment'

export default {
  namespace: 'posPaymentReport',

  state: {
    listTrans: [],
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
              from: location.query.from,
              to: location.query.to
            }
          })
        }
      })
    }
  },
  effects: {
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

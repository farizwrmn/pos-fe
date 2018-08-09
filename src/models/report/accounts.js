/**
 * Created by Veirry on 04/10/2017.
 */
// import { queryPaymentWithPOS } from '../../services/payment/payment'
import { Modal } from 'antd'
import { queryPaymentWithPOS, queryPaymentAR, queryPaymentARGroup } from '../../services/report/payment'
import { queryPayableWithBank } from '../../services/report/payable'

export default {
  namespace: 'accountsReport',

  state: {
    list: [],
    listTrans: [],
    listDaily: [],
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
        if (location.pathname === '/report/accounts/payment') {
          dispatch({
            type: 'setListNull'
          })
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: '1'
            }
          })
        } else if (location.pathname === '/report/accounts/payable') {
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
    * queryTrans ({ payload }, { call, put }) {
      let data = []
      if (payload) {
        data = yield call(queryPaymentWithPOS, payload)
      } else {
        data = yield call(queryPaymentWithPOS)
      }
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
    },
    * queryAR ({ payload }, { call, put }) {
      const data = yield call(queryPaymentAR, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listTrans: data.data,
            pagination: {
              total: data.total
            }
          }
        })
      } else {
        Modal.warning({
          title: 'No Data',
          content: 'Cannot get data from storage'
        })
        throw data
      }
    },
    * queryARGroup ({ payload }, { call, put }) {
      const data = yield call(queryPaymentARGroup, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listTrans: data.data,
            pagination: {
              total: data.total
            }
          }
        })
      } else {
        Modal.warning({
          title: 'No Data',
          content: 'Cannot get data from storage'
        })
        throw data
      }
    },
    * queryPayableTrans ({ payload }, { call, put }) {
      const data = yield call(queryPayableWithBank, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listTrans: data.data,
            pagination: {
              total: data.total
            }
          }
        })
      } else {
        Modal.warning({
          title: 'No Data',
          content: 'Cannot get data from storage'
        })
        throw data
      }
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
    setDate (state, action) {
      return { ...state, from: action.payload.from, to: action.payload.to, ...action.payload }
    },
    setListNull (state) {
      return {
        ...state,
        list: [],
        listTrans: [],
        listDaily: [],
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

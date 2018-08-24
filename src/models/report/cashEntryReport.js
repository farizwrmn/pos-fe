/**
 * Created by Veirry on 02/07/2018.
 */
import moment from 'moment'
import { queryTrans } from '../../services/report/cashEntryReport'

export default {
  namespace: 'cashEntryReport',

  state: {
    listTrans: [],
    listDetail: [],
    from: moment().format('YYYY-MM-DD'),
    to: moment().format('YYYY-MM-DD'),
    date: null,
    activeKey: '1',
    modalFilterCashEntryByTrans: false,
    modalFilterCashEntryByDetail: false,
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `Total ${total} Records`,
      current: 1,
      total: null
    }
  },
  subscriptions: {

  },
  effects: {
    * queryTrans ({ payload }, { call, put }) {
      let data = yield call(queryTrans, payload)
      if (data.success) {
        yield put({
          type: 'querySuccessTrans',
          payload: {
            listTrans: data.data,
            listDetail: data.detail || [],
            pagination: {
              total: data.total
            },
            from: payload.from,
            to: payload.to
          }
        })
      } else {
        throw data
      }
    }
  },
  reducers: {
    querySuccessTrans (state, action) {
      const { listTrans, listDetail, pagination, tmpList, from, to } = action.payload

      return {
        ...state,
        listTrans,
        listDetail,
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
        listTrans: [],
        from: moment().format('YYYY-MM-DD'),
        to: moment().format('YYYY-MM-DD'),
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

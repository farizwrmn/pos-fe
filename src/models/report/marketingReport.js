/**
 * Created by Veirry on 02/07/2018.
 */
import { queryTrans } from '../../services/report/cashEntryReport'

export default {
  namespace: 'marketingReport',

  state: {
    listTrans: [],
    listDetail: [],
    from: '',
    to: '',
    date: null,
    activeKey: '1',
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

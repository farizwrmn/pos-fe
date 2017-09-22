/**
 * Created by Veirry on 19/09/2017.
 */
import { query as queryReport, queryTrans } from '../../services/report/purchase'
import { queryMode as miscQuery} from '../../services/misc'

export default {
  namespace: 'purchaseReport',

  state: {
    list: [],
    listTrans: [],
    fromDate: '',
    toDate: '',
    productCode: 'ALL TYPE',
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `Total ${total} Records`,
      current: 1,
      total: null,
    },
  },
  subscriptions: {
  },
  effects: {
    * queryTrans ({ payload }, { call, put }) {
      let data = new Array()
      if (payload) {
        data = yield call (queryTrans, payload)
      } else {
        data = yield call (queryTrans)
      }
      yield put ({
        type: 'querySuccessTrans',
        payload: {
          listTrans: data.data,
          pagination: {
            total: data.total,
          },
        },
      })
    },
  },
  reducers: {
    querySuccessTrans (state, action) {
      const { listTrans, pagination, tmpList } = action.payload

      return { ...state,
        listTrans,
        tmpList,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
      }
    },
    setDate (state, action) {
      return { ...state, fromDate: action.payload.from, toDate: action.payload.to}
    },
    setListNull (state, action) {
      return { ...state, list: [], listTrans: []}
    },
  },
}

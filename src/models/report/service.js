/**
 * Created by Veirry on 18/09/2017.
 */
import { query as queryReport } from '../../services/report/service'
import { queryMode as miscQuery} from '../../services/misc'
import { parse } from 'qs'
import { routerRedux } from 'dva/router'

export default {
  namespace: 'serviceReport',

  state: {
    list: [],
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
    setup ({ dispatch, history }) {
    },
  },
  effects: {
    * query ({ payload }, { call, put }) {
      let data = []
      if (payload) {
        data = yield call (queryReport, payload)
      } else {
        data = yield call (queryReport)
      }
      yield put ({
        type: 'querySuccess',
        payload: {
          list: data.data,
          pagination: {
            total: data.total,
          },
        },
      })
    },
  },
  reducers: {
    querySuccess (state, action) {
      const { list, pagination, tmpList } = action.payload

      return { ...state,
        list,
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
      return { ...state, list: []}
    },
  },
}

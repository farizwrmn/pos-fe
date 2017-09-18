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
    company: localStorage.getItem('company') ? JSON.parse(localStorage.getItem('company')) : [],
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
      history.listen(location => {
        if (location.pathname === '/report/pos/monthly') {
          dispatch({
            type: 'queryCompany',
          })
        }
      })
    },
  },
  effects: {
    * query ({ payload }, { call, put }) {
      var data = []
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
    * queryCompany ({ payload }, { call, put }) {
      const load = { code: 'company'}
      const data = yield call(miscQuery, load)
      if(data.data != []) {
        localStorage.setItem('company', JSON.stringify(data.data))
      } else {
        console.log('unexpected error misc')
      }
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

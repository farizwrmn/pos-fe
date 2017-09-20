/**
 * Created by Veirry on 10/09/2017.
 */
import { query as queryReport, queryTrans } from '../../services/report/pos'
import { queryMode as miscQuery} from '../../services/misc'
import { parse } from 'qs'
import { routerRedux } from 'dva/router'

export default {
  namespace: 'posReport',

  state: {
    list: [],
    listTrans: [],
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
        if (location.pathname === '/report/pos/monthly' || location.pathname === '/report/pos/summary/trans') {
          dispatch({
            type: 'queryCompany',
          })
        }
      })
    },
  },
  effects: {
    * queryPart ({ payload }, { call, put }) {
      let data = []
      if (payload) {
        data = yield call (queryReport, payload)
      } else {
        data = yield call (queryReport)
      }
      yield put ({
        type: 'querySuccessPart',
        payload: {
          list: data.data,
          pagination: {
            total: data.total,
          },
        },
      })
    },
    * queryTrans ({ payload }, { call, put }) {
      let data = []
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
    querySuccessPart (state, action) {
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

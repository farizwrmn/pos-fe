/**
 * Created by Veirry on 22/09/2017.
 */
import { query as queryAllPeriod, queryCode as queryCodePeriod, create as createPeriod } from '../services/period'

export default {
  namespace: 'period',

  state: {
    list: [],
    fromDate: '',
    toDate: '',
    currentItem: {},
    modalType: 'add',
    modalVisible: false,
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
      history.listen((location) => {
        if (location.pathname === '/setting/periods') {
          dispatch({
            type: 'queryPeriod',
            payload: location.query,
          })
        }
      })
    },
  },
  effects: {
    * queryPeriod ({ payload = {} }, { call, put }) {
      const data = yield call(queryAllPeriod)
      yield put({
        type: 'querySuccessPeriod',
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
    querySuccessPeriod (state, action) {
      const { list, pagination } = action.payload

      return { ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
      }
    },
    setDate (state, action) {
      return { ...state, fromDate: action.payload.from, toDate: action.payload.to}
    },
    modalShow (state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },
    modalHide (state) {
      return { ...state, modalVisible: false }
    },
  },
}

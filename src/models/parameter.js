import { queryId } from 'services/utils/parameter'

// const success = () => {
//   message.success('Success')
// }

export default {
  namespace: 'parameter',

  state: {
    list: [],
    currentItem: {},
    modalVisible: false,
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
      showSizeChanger: true
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location
        if (pathname === '/transaction/pos') {
          dispatch({
            type: 'queryParameter',
            payload: {
              paramCode: 'electronABTesting'
            }
          })
        }
      })
    }
  },

  effects: {
    * queryParameter ({ payload = {} }, { call, put }) {
      // Hanya Kepala Toko dengan store yang telah ditentukan
      // get paramCode like electronABTesting to targeted storeId had access to electron POS
      // payload { paramCode: 'electronABTesting' }
      const response = yield call(queryId, payload)
      if (response && response.success) {
        // validate current storeId
        yield put({
          type: 'updateState',
          payload: {
            currentItem: response.data
          }
        })
      }
    }
  },

  reducers: {
    updateState (state, { payload }) {
      return { ...state, ...payload }
    },
    querySuccess (state, action) {
      const { list, pagination } = action.payload
      return {
        ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    }
  }
}

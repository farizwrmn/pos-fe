import { message } from 'antd'
import {
  getDataEmployeeByUserId,
  checkUserRole
} from 'services/fingerprint/fingerprintEmployee'

// const success = () => {
//   message.success('Success')
// }

export default {
  namespace: 'fingerEmployee',

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
        if (pathname === '/inventory/transfer/in' || pathname === '/transaction/pos') {
          dispatch({
            type: 'updateState',
            payload: {
              currentItem: {}
            }
          })
        }
      })
    }
  },

  effects: {
    * setEmployee ({ payload = {} }, { call, put }) {
      const response = yield call(getDataEmployeeByUserId, payload)
      const checkUserRoleResponse = yield call(checkUserRole, payload)

      if (response && response.success) {
        if (checkUserRoleResponse.data && checkUserRoleResponse.data.length > 0) {
          yield put({
            type: 'updateState',
            payload: {
              currentItem: response.data[0]
            }
          })
        } else {
          message.info('Hanya Kepala Toko yang boleh menginput expense')
        }
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

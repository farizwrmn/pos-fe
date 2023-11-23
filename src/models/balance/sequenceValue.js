import { message } from 'antd'
import {
  query,
  checkUserRole
} from 'services/balance/sequenceValue'
import { lstorage } from 'utils'

// const success = () => {
//   message.success('Success')
// }

export default {
  namespace: 'sequenceValue',

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

  effects: {
    * query ({ payload = {} }, { call, put }) {
      const response = yield call(query, payload)
      const checkUserRoleResponse = yield call(checkUserRole, payload)

      if (response && response.success) {
        if (checkUserRoleResponse.data && checkUserRoleResponse.data.length > 0) {
          yield put({
            type: 'updateState',
            payload: {
              currentItem: response.data
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

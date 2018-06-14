import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import { querySupplier, add } from '../../services/master/supplierBank'
import { pageModel } from './../common'

const success = () => {
  message.success('Bank has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'supplierBank',

  state: {
    currentItem: {},
    listSupplierBank: [],
    searchText: ''
  },

  subscriptions: {
    // setup ({ dispatch, history }) {
    //   history.listen((location) => {
    //     const { activeKey } = location.query
    //     const { pathname } = location
    //     if (pathname === '/master/city') {
    //       // if (!activeKey) {
    //       //   dispatch(routerRedux.push({
    //       //     pathname,
    //       //     query: {
    //       //       activeKey: '0'
    //       //     }
    //       //   }))
    //       // }
    //       dispatch({
    //         type: 'updateState',
    //         payload: {
    //           activeKey: activeKey || '0'
    //         }
    //       })
    //       if (activeKey === '1') dispatch({ type: 'query' })
    //     }
    //   })
    // }
  },

  effects: {
    * querySupplier ({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          listSupplierBank: []
        }
      })
      const data = yield call(querySupplier, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listSupplierBank: data.data
          }
        })
      } else {
        throw data
      }
    },
    * add ({ payload }, { call, put }) {
      const data = yield call(add, payload)
      if (data.success) {
        success()
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {},
            modalAddBankVisible: false
          }
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: payload,
            modalAddBankVisible: true
          }
        })
        throw data
      }
    }
  },

  reducers: {
    updateState (state, { payload }) {
      return { ...state, ...payload }
    }
  }
})

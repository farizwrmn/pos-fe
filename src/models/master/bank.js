import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import { query, add } from '../../services/master/bank'
import { pageModel } from './../common'

const success = () => {
  message.success('Bank has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'bank',

  state: {
    currentItem: {},
    listBank: [],
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
    * query ({ payload }, { call, put }) {
      const data = yield call(query, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listBank: data.data
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
          }
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: payload.data
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

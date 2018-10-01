import { configMain } from 'utils'
import modelExtend from 'dva-model-extend'
import moment from 'moment'
import { query } from '../../services/marketing/bundlingReward'
import { queryPOSproduct } from '../../services/master/productstock'
import { pageModel } from './../common'

const { prefix } = configMain

export default modelExtend(pageModel, {
  namespace: 'bundlingReward',

  state: {
    currentItem: {},
    modalType: 'add',
    activeKey: '0',
    searchText: null,
    typeModal: null,
    listReward: [],
    modalPromoVisible: false,
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    }
  },

  subscriptions: {
    // setup ({ dispatch, history }) {
    //   history.listen((location) => {
    //     const { pathname } = location
    //     if (pathname === '/transaction/pos') {
    //       dispatch({ type: 'query', payload: { storeId: lstorage.getCurrentUserStore() } })
    //     }
    //   })
    // }
  },

  effects: {
    * query ({ payload = {} }, { call, put }) {
      payload.active = 1
      const data = yield call(query, payload)
      if (data.success) {
        yield put({
          type: 'showProductQty',
          payload: {
            data: data.data
          }
        })
        yield put({
          type: 'querySuccessReward',
          payload: {
            listReward: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total
            }
          }
        })
      } else {
        throw data
      }
    },
    * showProductQty ({ payload }, { call, put }) {
      let { data } = payload
      const storeInfo = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : {}
      const newData = data.map(x => x.productId)

      const listProductData = yield call(queryPOSproduct, { from: storeInfo.startPeriod, to: moment().format('YYYY-MM-DD'), product: (newData || []).toString() })
      if (listProductData.success) {
        for (let n = 0; n < (listProductData.data || []).length; n += 1) {
          data = data.map((x) => {
            if (x.active !== '1') {
              return {
                qty: 0,
                stock: listProductData.data[n].count || 0,
                ...x
              }
            }
            if (x.productId === listProductData.data[n].id) {
              const { count, ...other } = x
              return {
                ...other,
                stock: listProductData.data[n].count || 0,
                ...listProductData.data[n]
              }
            }
            return x
          })
        }
        yield put({
          type: 'updateState',
          payload: {
            listReward: data
          }
        })
      } else {
        throw listProductData
      }
    }
  },

  reducers: {
    querySuccessReward (state, action) {
      const { listReward, pagination } = action.payload
      return {
        ...state,
        listReward,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },

    updateState (state, { payload }) {
      return { ...state, ...payload }
    },

    changeTab (state, { payload }) {
      const { key } = payload
      return {
        ...state,
        activeKey: key,
        modalType: 'add',
        currentItem: {}
      }
    }
  }
})

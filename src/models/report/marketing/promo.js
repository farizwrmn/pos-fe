import modelExtend from 'dva-model-extend'
import { pageModel } from './../../common'
import { queryPromoDetail } from '../../../services/report/marketing/promo'


export default modelExtend(pageModel, {
  namespace: 'promo',

  state: {
    listMarketingPromo: [],
    activeKey: '0',
    fromDate: '',
    toDate: ''
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        dispatch({ type: 'refreshPage' })
        const { activeKey } = location.query
        const { pathname } = location
        if (pathname === 'report/marketing/promo') {
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || '0'
            }
          })
        }
      })
    }
  },

  effects: {

    * queryPromoDetail ({ payload = {} }, { call, put }) {
      const data = yield call(queryPromoDetail, payload)
      if (data.success) {
        yield put({
          type: 'querySuccessMarketingPromo',
          payload: {
            data,
            fromDate: payload.from,
            toDate: payload.to,
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
    }
  },

  reducers: {
    querySuccessMarketingPromo (state, action) {
      const { data, pagination, fromDate, toDate } = action.payload
      let parent = data.data
      let listMarketingPromo = []
      for (let key in parent) {
        let master = parent[key]
        let products = data.detail.filter(x => x.transNoId === master.transNoId)
        listMarketingPromo.push(Object.assign(master, { products }))
      }
      return {
        ...state,
        fromDate,
        toDate,
        listMarketingPromo,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },

    refreshPage (state) {
      return {
        ...state,
        activeKey: '0',
        listMarketingPromo: [],
        pagination: {
          showSizeChanger: true,
          showQuickJumper: true,
          current: 1
        }
      }
    }
  }
})

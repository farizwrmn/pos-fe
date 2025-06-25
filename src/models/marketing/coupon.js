import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { message } from 'antd'
import { query, add, edit, remove } from 'services/marketing/coupon'
import { query as queryStock } from '../../services/master/productstock'
import { query as queryReward } from '../../services/marketing/couponReward'
import { pageModel } from '../common'

const success = () => {
  message.success('Coupon has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'coupon',

  state: {
    currentItem: {},
    modalType: 'add',
    activeKey: '0',
    list: [],
    invoiceCancel: '',
    typeModal: null,
    listBundling: [],
    listRules: [],
    listReward: [],
    itemEditListRules: {},
    itemEditListReward: {},
    modalProductVisible: false,
    modalEditRulesVisible: false,
    modalEditRewardVisible: false,
    modalCancelVisible: false,
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { activeKey, ...other } = location.query
        const { pathname } = location
        if (pathname === '/marketing/coupon') {
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || '0',
              listReward: [],
              listRules: [],
              listBundling: []
            }
          })
          if (activeKey === '1') dispatch({ type: 'query', payload: other })
        }
      })
    }
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, {
        ...payload
      })
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            pagination: {
              current: Number(data.page) || 1,
              pageSize: Number(data.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    },

    * querySomeProducts ({ payload }, { select, call, put }) {
      const data = yield call(queryStock, { id: payload.selectedRowKeys, field: 'id,productCode,productName,sellPrice', type: 'all' })
      let listReward = yield select(({ coupon }) => coupon.listReward)
      let typeModal = yield select(({ coupon }) => coupon.typeModal)
      if (data.success) {
        if (typeModal === 'Reward') {
          for (let n = 0; n < data.data.length; n += 1) {
            const exists = listReward.filter(el => el.productId === parseFloat(data.data[n].id))
            if (exists.length === 0) {
              const tempData = {
                no: listReward.length + 1,
                productId: data.data[n].id,
                productCode: data.data[n].productCode,
                productName: data.data[n].productName,
                type: 'P',
                qty: 1,
                sellPrice: data.data[n].sellPrice,
                distPrice01: data.data[n].distPrice01,
                distPrice02: data.data[n].distPrice02,
                distPrice03: data.data[n].distPrice03,
                distPrice04: data.data[n].distPrice04,
                distPrice05: data.data[n].distPrice05,
                distPrice06: data.data[n].distPrice06,
                distPrice07: data.data[n].distPrice07,
                distPrice08: data.data[n].distPrice08,
                distPrice09: data.data[n].distPrice09,
                discount: 0,
                disc1: 0,
                disc2: 0,
                disc3: 0
              }
              listReward.push(tempData)
            } else {
              listReward[exists[0].no - 1].qty = listReward[exists[0].no - 1].qty + 1
            }
          }
          yield put({
            type: 'updateState',
            payload: {
              listReward,
              modalProductVisible: false
            }
          })
        }
        yield put({
          type: 'productstock/updateState',
          payload: {
            selectedRowKeys: []
          }
        })
      } else {
        throw data
      }
    },

    * delete ({ payload }, { call, put }) {
      const data = yield call(remove, payload)
      if (data.success) {
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * add ({ payload }, { call, put, select }) {
      try {
        const { data, reset } = payload

        if (!data.couponName || !data.startDate || !data.endDate) {
          throw new Error('Missing required coupon data')
        }

        const listReward = yield select(state => state.coupon.listReward || [])

        const productId = listReward.map(item => item.productId)

        const fullData = {
          ...data,
          productId
        }

        const response = yield call(add, fullData)

        if (response.success) {
          success()
          yield put({
            type: 'updateState',
            payload: {
              modalType: 'add',
              activeKey: '1',
              currentItem: {}
            }
          })

          const { pathname } = location
          yield put(routerRedux.push({
            pathname,
            query: { activeKey: '1' }
          }))

          if (reset) {
            reset()
          }
        } else {
          yield put({
            type: 'updateState',
            payload: { currentItem: payload }
          })
          throw response
        }
      } catch (error) {
        console.error('Coupon add error:', error.message || error)
        throw error
      }
    },

    * edit ({ payload }, { select, call, put }) {
      const id = yield select(({ coupon }) => coupon.currentItem.id)
      const listReward = yield select(({ coupon }) => coupon.listReward || [])

      const { data, reset } = payload
      const productId = listReward.map(item => item.productId)

      const newCounter = { ...data, id, productId }

      const response = yield call(edit, newCounter)

      if (response.success) {
        success()
        yield put({ type: 'updateState', payload: { modalType: 'add', currentItem: {}, activeKey: '1' } })
        const { pathname } = location
        yield put(routerRedux.push({ pathname, query: { activeKey: '1' } }))
        yield put({ type: 'query' })
        if (reset) reset()
      } else {
        yield put({ type: 'updateState', payload: { currentItem: payload } })
        throw response
      }
    },

    * editItem ({ payload = {} }, { call, put }) {
      const response = yield call(queryReward, payload.item.id)

      if (!response.success) {
        throw response
      }

      const couponData = response.data
      const detailProducts = couponData.detailProduct || []

      const listReward = detailProducts.map((item, index) => ({
        no: index + 1,
        id: item.id || undefined, // if available
        productId: item.productId,
        productName: item.productName,
        productCode: item.productCode,
        qty: 1, // default values if not provided
        sellPrice: 0,
        sellingPrice: 0,
        distPrice01: 0,
        distPrice02: 0,
        distPrice03: 0,
        distPrice04: 0,
        distPrice05: 0,
        distPrice06: 0,
        distPrice07: 0,
        distPrice08: 0,
        distPrice09: 0,
        disc1: 0,
        disc2: 0,
        disc3: 0,
        discount: 0,
        hide: false,
        replaceable: false
      }))

      yield put({
        type: 'updateState',
        payload: {
          modalType: 'edit',
          activeKey: '0',
          currentItem: couponData,
          listRules: [],
          listReward
        }
      })
    }
  },

  reducers: {
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
    },

    editItem (state, { payload }) {
      const { item } = payload
      return {
        ...state,
        modalType: 'edit',
        activeKey: '0',
        currentItem: item
      }
    }
  }
})

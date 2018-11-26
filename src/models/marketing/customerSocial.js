import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { message } from 'antd'
import { query, add, edit, remove } from '../../services/marketing/customerSocial'
import { pageModel } from './../common'

const success = () => {
  message.success('Social has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'customerSocial',

  state: {
    currentItem: {},
    modalType: 'add',
    activeKey: '0',
    listCustomerSocial: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    }
  },

  subscriptions: {
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data.success) {
        yield put({
          type: 'querySuccessCounter',
          payload: {
            listCustomerSocial: data.data.map(data => ({ ...data, type: 'edit' })),
            pagination: {
              current: Number(data.page) || 1,
              pageSize: Number(data.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    },

    * delete ({ payload }, { call }) {
      const data = yield call(remove, payload)
      if (!data.success) {
        throw data
      }
    },

    * deleteItem ({ payload }, { put }) {
      const { data, index } = payload
      let arrayProd = data.slice()
      Array.prototype.remove = function () {
        let what
        let a = arguments
        let L = a.length
        let ax
        while (L && this.length) {
          what = a[L -= 1]
          while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1)
          }
        }
        return this
      }
      let ary = arrayProd
      ary.remove(arrayProd[index])

      yield put({
        type: 'updateState',
        payload: {
          listCustomerSocial: ary
        }
      })
    },

    * add ({ payload }, { call, put }) {
      const data = yield call(add, payload)
      if (data.success) {
        success()
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {}
          }
        })
        yield put({
          type: 'query'
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: payload
          }
        })
        throw data
      }
    },

    * edit ({ payload }, { select, call, put }) {
      const id = yield select(({ customerSocial }) => customerSocial.currentItem.id)
      const newCounter = { ...payload, id }
      const data = yield call(edit, newCounter)
      if (data.success) {
        success()
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {},
            activeKey: '1'
          }
        })
        const { pathname } = location
        yield put(routerRedux.push({
          pathname,
          query: {
            activeKey: '1'
          }
        }))
        yield put({ type: 'query' })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: payload
          }
        })
        throw data
      }
    }
  },

  reducers: {
    querySuccessCounter (state, action) {
      const { listCustomerSocial, pagination } = action.payload
      return {
        ...state,
        listCustomerSocial,
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

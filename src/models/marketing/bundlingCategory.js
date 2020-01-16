import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { message, Modal } from 'antd'
import { posTotal } from 'utils'
import { query as querySequence } from '../../services/sequence'
import { query, add, edit, remove, cancel } from '../../services/marketing/bundling'
import { query as queryRules } from '../../services/marketing/bundlingRules'
import { query as queryReward } from '../../services/marketing/bundlingReward'
import { pageModel } from './../common'

const success = () => {
  message.success('Bundling has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'bundlingCategory',

  state: {
    currentItem: {},
    modalType: 'add',
    activeKey: '0',
    invoiceCancel: '',
    typeModal: null,
    listBundling: [],
    listRules: [],
    /*
    type: 'S' / 'P'
    if (update) bundleId: item.bundleId
    productId: 'P' item.id
    serviceId: 'S' item.id
    productCode: item.productCode
    productName: item.productName
    qty: item.qty
    */
    listReward: [],
    /*
    type: 'S' / 'P'
    if (update) bundleId: item.bundleId
    productId: 'P' item.id : null
    serviceId: 'S' item.id : null
    productCode: item.productCode
    productName: item.productName
    qty: item.qty
    sellPrice: item.sellPrice
    distPrice01: item.distPrice01
    distPrice02: item.distPrice02
    distPrice03: item.distPrice03
    discount: item.discount
    disc1: item.disc1
    disc2: item.disc2
    disc3: item.disc3
    total: item.total
    */
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
        if (pathname === '/marketing/promocategory') {
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || '0'
            }
          })
          if (activeKey === '1') dispatch({ type: 'query', payload: other })
          // dispatch({
          //   type: 'query',
          //   payload: {
          //     type: 'all'
          //   }
          // })
          dispatch({ type: 'querySequence' })
        }
      })
    }
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data.success) {
        yield put({
          type: 'querySuccessCounter',
          payload: {
            listBundling: data.data,
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

    * querySequence (payload, { select, call, put }) {
      const invoice = {
        seqCode: 'PRC',
        type: 1
      }
      const data = yield call(querySequence, invoice)
      const currentItem = yield select(({ bundlingCategory }) => bundlingCategory.currentItem)
      const modalType = yield select(({ bundlingCategory }) => bundlingCategory.modalType)
      if (modalType === 'add') {
        const code = data.data
        yield put({
          type: 'updateState',
          payload: {
            currentItem: {
              ...currentItem,
              code
            }
          }
        })
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

    * add ({ payload }, { call, put }) {
      const checkExists = payload.listReward.filter(el => el.total < 0)
      if ((payload.listReward || []).length > 0 && (payload.listRules || []).length > 0) {
        if ((checkExists || []).length === 0) {
          const data = yield call(add, payload)
          if (data.success) {
            success()
            yield put({
              type: 'updateState',
              payload: {
                modalType: 'add',
                currentItem: {},
                listRules: [],
                listReward: []
              }
            })
            yield put({
              type: 'query',
              payload: {
                type: 'all'
              }
            })
            yield put({ type: 'querySequence' })
          } else {
            yield put({
              type: 'updateState',
              payload: {
                currentItem: payload.data
              }
            })
            throw data
          }
        } else {
          Modal.warning({
            title: "Total's value is below zero",
            content: 'You have a product with below zero total'
          })
          yield put({
            type: 'updateState',
            payload: {
              currentItem: payload.data
            }
          })
        }
      } else {
        Modal.warning({
          title: 'No Item Rules or Reward',
          content: 'Please choose reward or rules item'
        })
        yield put({
          type: 'updateState',
          payload: {
            currentItem: payload.data
          }
        })
      }
    },

    * edit ({ payload }, { select, call, put }) {
      const id = yield select(({ bundlingCategory }) => bundlingCategory.currentItem.id)
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
    },
    * editItem ({ payload = {} }, { call, put }) {
      const dataRules = yield call(queryRules, { type: 'all', bundleId: payload.item.id })
      const dataReward = yield call(queryReward, { type: 'all', bundleId: payload.item.id })
      if (!dataRules.success) {
        throw dataRules
      }
      if (!dataReward.success) {
        throw dataReward
      }
      let listRules = []
      let listReward = []
      for (let n = 0; n < (dataRules.data || []).length; n += 1) {
        listRules.push({
          no: n + 1,
          type: dataRules.data[n].type,
          productId: dataRules.data[n].productId,
          productCode: dataRules.data[n].productCode,
          productName: dataRules.data[n].productName,
          qty: dataRules.data[n].qty
        })
      }
      for (let n = 0; n < (dataReward.data || []).length; n += 1) {
        listReward.push({
          no: n + 1,
          type: dataReward.data[n].type,
          productId: dataReward.data[n].productId,
          productCode: dataReward.data[n].productCode,
          productName: dataReward.data[n].productName,
          qty: dataReward.data[n].qty,
          disc1: dataReward.data[n].disc1,
          disc2: dataReward.data[n].disc2,
          disc3: dataReward.data[n].disc3,
          discount: dataReward.data[n].discount,
          total: posTotal(dataReward.data[n])
        })
      }
      yield put(routerRedux.push({
        pathname: payload.pathname,
        query: {
          activeKey: 0
        }
      }))
      yield put({
        type: 'updateState',
        payload: {
          modalType: 'edit',
          activeKey: '0',
          currentItem: payload.item,
          listRules,
          listReward
        }
      })
    },
    * voidTrans ({ payload = {} }, { call, put }) {
      if (payload.id) {
        const data = yield call(cancel, payload)
        if (data.success) {
          yield put({
            type: 'updateState',
            payload: {
              currentItem: {},
              invoiceCancel: '',
              modalCancelVisible: false
            }
          })
          yield put({ type: 'query' })
        } else {
          throw data
        }
      }
    }
  },

  reducers: {
    querySuccessCounter (state, action) {
      const { listBundling, pagination } = action.payload
      return {
        ...state,
        listBundling,
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

import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { message, Modal } from 'antd'
import { posTotal } from 'utils'
import { query as querySequence } from '../../services/sequence'
import { query as queryStock } from '../../services/master/productstock'
import { query, add, edit, remove, cancel } from '../../services/marketing/bundling'
import { query as queryRules } from '../../services/marketing/bundlingRules'
import { query as queryReward } from '../../services/marketing/bundlingReward'
import { pageModel } from './../common'

const success = () => {
  message.success('Bundling has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'bundling',

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
        if (pathname === '/marketing/promo') {
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || '0',
              listReward: [],
              listRules: [],
              listBundling: []
            }
          })
          if (activeKey === '1') {
            dispatch({ type: 'query', payload: other })
          }
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

    * querySomeProducts ({ payload }, { select, call, put }) {
      const data = yield call(queryStock, { id: payload.selectedRowKeys, field: 'id,productCode,productName,sellPrice', type: 'all' })
      let listRules = yield select(({ bundling }) => bundling.listRules)
      let listReward = yield select(({ bundling }) => bundling.listReward)
      let typeModal = yield select(({ bundling }) => bundling.typeModal)
      if (data.success) {
        if (typeModal === 'Rules') {
          for (let n = 0; n < data.data.length; n += 1) {
            const exists = listRules.filter(el => el.productId === parseFloat(data.data[n].id))
            if (exists.length === 0) {
              listRules.push({
                no: listRules.length + 1,
                productId: data.data[n].id,
                productCode: data.data[n].productCode,
                productName: data.data[n].productName,
                type: 'P',
                qty: 1
              })
            } else {
              listRules[exists[0].no - 1].qty = listRules[exists[0].no - 1].qty + 1
            }
          }
          yield put({
            type: 'updateState',
            payload: {
              listRules,
              modalProductVisible: false
            }
          })
        } else if (typeModal === 'Reward') {
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
                discount: 0,
                disc1: 0,
                disc2: 0,
                disc3: 0
              }
              tempData.total = posTotal(tempData)
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

    * querySequence (payload, { select, call, put }) {
      const invoice = {
        seqCode: 'PRM',
        type: 1
      }
      const data = yield call(querySequence, invoice)
      const currentItem = yield select(({ bundling }) => bundling.currentItem)
      const modalType = yield select(({ bundling }) => bundling.modalType)
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
      if ((payload.listReward || []).length > 0 || (payload.listRules || []).length > 0) {
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
      const id = yield select(({ bundling }) => bundling.currentItem.id)
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
        dataReward.data[n].sellingPrice = dataReward.data[n].sellPrice
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

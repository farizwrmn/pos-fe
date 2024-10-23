import modelExtend from 'dva-model-extend'
import { routerRedux } from 'dva/router'
import { message } from 'antd'
import { lstorage } from 'utils'
import { query as querySequence } from 'services/sequence'
// import { queryEntryList } from 'services/payment/bankentry'
// import {
//   AJIN,
//   AJOUT,
//   MUOUT
// } from 'utils/variable'
import pathToRegexp from 'path-to-regexp'
import { queryById as queryProductById } from 'services/master/productstock'
import { query, queryById, add, edit, remove } from 'services/repacking/repackingSpk'
import { query as queryStandardRecipe, queryListDetail as queryStandardRecipeDetail } from 'services/repacking/standardRecipe'
import { pageModel } from 'models/common'

const isInt = (n) => {
  return Number(n) === n && n % 1 === 0
}

const success = () => {
  message.success('Repacking Spk has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'repackingSpk',

  state: {
    listDetail: [],
    listAccounting: [],
    data: {},

    detail: [],
    materialRequest: [],
    currentItem: {},
    modalType: 'add',
    activeKey: '0',
    modalMemberTierVisible: false,
    modalMemberTierItem: {},
    modalMemberTierType: 'add',
    list: [],
    pagination: {
      current: 1
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { activeKey, ...other } = location.query
        const { pathname } = location
        const match = pathToRegexp('/repacking-spk/:id').exec(location.pathname)
        if (match) {
          dispatch({
            type: 'queryDetail',
            payload: {
              id: decodeURIComponent(match[1]),
              storeId: lstorage.getCurrentUserStore(),
              match
            }
          })
        }
        if (pathname === '/repacking-spk') {
          dispatch({
            type: 'querySequence'
          })
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || '0'
            }
          })
          if (activeKey === '1') dispatch({ type: 'query', payload: other })
        }
      })
    }
  },

  effects: {
    * queryDetail ({ payload = {} }, { call, put }) {
      const response = yield call(queryById, payload)
      if (response.success && response.data) {
        // let listAccounting = []
        // if (payload && payload.match && response.data && response.data.id) {
        //   const reconData = yield call(queryEntryList, {
        //     transactionId: response.data.id,
        //     transactionType: AJIN,
        //     type: 'all'
        //   })
        //   if (reconData && reconData.data) {
        //     listAccounting = listAccounting.concat(reconData.data)
        //   }
        // }

        console.log('test', response.materialRequest)
        yield put({
          type: 'updateState',
          payload: {
            data: response.data,
            listDetail: response.detailRequest,
            materialRequest: response.materialRequest
            // listAccounting
          }
        })
      } else {
        throw response
      }
    },

    * querySequence (payload, { select, call, put }) {
      const invoice = {
        seqCode: 'REP',
        type: lstorage.getCurrentUserStore()
      }
      const data = yield call(querySequence, invoice)
      const currentItem = yield select(({ repackingSpk }) => repackingSpk.currentItem)
      const transNo = data.data
      yield put({
        type: 'updateState',
        payload: {
          currentItem: {
            ...currentItem,
            transNo
          }
        }
      })
    },

    * query ({ payload = {} }, { call, put }) {
      payload.storeId = lstorage.getCurrentUserStore()
      payload.order = '-id'
      const response = yield call(query, payload)
      if (response.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: response.data,
            pagination: {
              current: Number(response.page) || 1,
              pageSize: Number(response.pageSize) || 10,
              total: response.total
            }
          }
        })
      }
    },

    * addRecipe ({ payload = {} }, { select, call, put }) {
      const detail = yield select(({ repackingSpk }) => repackingSpk.detail)
      const response = yield call(queryProductById, { id: payload.productCode })
      if (response && response.success && response.data) {
        const responseStandardRecipe = yield call(queryStandardRecipe, { productId: response.data.id })
        if (!responseStandardRecipe.success || (responseStandardRecipe && responseStandardRecipe.data && responseStandardRecipe.data.length === 0)) {
          throw new Error('Standard Recipe Not Found')
        }
        const standardRecipe = responseStandardRecipe.data[0]
        const responseStandardRecipeDetail = yield call(queryStandardRecipeDetail, { transId: standardRecipe.id })
        if (!responseStandardRecipeDetail.success || (responseStandardRecipeDetail && responseStandardRecipeDetail.data && responseStandardRecipe.data.length === 0)) {
          throw new Error('Standard Recipe Material Not Found')
        }
        const standardRecipeDetail = responseStandardRecipeDetail.data
        yield put({
          type: 'repackingSpk/updateState',
          payload: {
            modalMemberTierVisible: false,
            modalMemberTierType: 'add',
            detail: detail
              .filter(filtered => filtered.productCode !== payload.productCode)
              .concat({
                productName: response.data.productName,
                productCode: response.data.productCode,
                productId: response.data.id,
                qty: payload.qty,
                minQty: payload.minQty,
                maxQty: payload.maxQty,
                standardRecipeId: standardRecipe.id,
                material: standardRecipeDetail.map((item) => {
                  if (!isInt(item.qty * payload.qty)) {
                    throw new Error(`Nilai material tidak genap, material: ${item.qty}`)
                  }
                  return ({
                    productName: item.productName,
                    productCode: item.productCode,
                    productId: item.productId,
                    qty: item.qty * payload.qty,
                    minQty: item.qty * payload.minQty,
                    maxQty: item.qty * payload.maxQty,
                    standardRecipeId: standardRecipe.id
                  })
                })
              }).sort((a, b) => a.productCode - b.productCode)
          }
        })
      } else {
        throw new Error('Product Not Found')
      }
    },

    * delete ({ payload }, { call, put }) {
      const response = yield call(remove, payload)
      if (response.success) {
        yield put({ type: 'query' })
      } else {
        throw response
      }
    },

    * add ({ payload }, { call, put }) {
      if (payload.data && payload.data.detail && payload.data.detail.length === 0) {
        throw new Error('Detail is empty')
      }
      const response = yield call(add, payload.data)
      if (response.success) {
        success()
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {},
            detail: []
          }
        })
        if (response.data) {
          const invoiceWindow = window.open(`/repacking-spk/${response.data.id}`)
          if (invoiceWindow) {
            invoiceWindow.focus()
          } else {
            message.error('Please allow pop-up in your browser')
          }
        }
        yield put({
          type: 'query'
        })
        yield put({
          type: 'querySequence'
        })
        if (payload.reset) {
          payload.reset()
        }
      } else {
        throw response
      }
    },

    * edit ({ payload }, { select, call, put }) {
      const id = yield select(({ repackingSpk }) => repackingSpk.currentItem.id)
      const newCounter = { ...payload.data, id }
      const response = yield call(edit, newCounter)
      if (response.success) {
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
        if (payload.reset) {
          payload.reset()
        }
      } else {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: payload
          }
        })
        throw response
      }
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

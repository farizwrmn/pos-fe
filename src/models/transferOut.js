import modelExtend from 'dva-model-extend'
import { query, add } from '../services/transferStockOut'
import { query as queryStore } from '../services/store'
import {
  query as querySequence,
  increase as increaseSequence,
} from '../services/sequence'
import { pageModel } from './common'
import { message } from 'antd'
import { lstorage } from 'utils'

const success = () => {
  message.success('Transfer process has been saved, waiting for confirmation.')
}

const error = (err) => {
  message.error(err.message)
}
export default modelExtend(pageModel, {
  namespace: 'transferOut',
  state: {
    listTrans: [],
    listItem: [],
    listStore: [],
    currentItem: {},
    currentItemList: {},
    modalVisible: false,
    modalConfirmVisible: false,
    searchVisible: false,
    formType: 'add',
    display: 'none',
    activeKey: '0',
    disable: '',
    pagination: {
      // showSizeChanger: true,
      // showQuickJumper: true,
      showTotal: total => `Total ${total} Records`,
      current: 1,
      total: null,
      pageSize: 5
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/inventory/transfer/out') {
          dispatch({
            type: 'querySequence',
            payload: {
              seqCode: 'MUOUT',
              type: lstorage.getCurrentUserStore() // diganti dengan StoreId
            },
          })
        }
        // else if (location.pathname === '/inventory/transfer/in') {
        //   dispatch({
        //     type: 'query',
        //   })
        // }
      })
    },
  },

  effects: {
    * query({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data) {
        yield put({
          type: 'querySuccessTransferOut',
          payload: {
            listTrans: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 5,
              total: data.total,
            },
          },
        })
      }
    },
    * querySequence({ payload }, { call, put }) {
      yield put({ type: 'resetState' })
      const store = yield call(queryStore)
      const data = yield call(querySequence, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: {
              transNo: data.data,
            },
            listStore: store.data
          }
        })
      } else {
        throw (data)
      }
    },
    * add({ payload }, { call, put }) {
      const sequenceData = {
        seqCode: 'MUOUT',
        type: lstorage.getCurrentUserStore() // diganti dengan StoreId
      }
      const sequence = yield call(querySequence, sequenceData)
      payload.transNo = sequence.data
      let data = {}
      try {
        data = yield call(add, payload)
      } catch (error) {
        error(error)
        throw error
      }
      if (data.success) {
        success()
        let increase = yield call(increaseSequence, sequenceData)
        if (!increase.success) {
          error(increaseSequence)
        }
        yield put({
          type: 'updateState',
          payload: {
            modalConfirmVisible: true
          }
        })
      } else {
        error(data)
        throw data
      }
    },
    * deleteListState({ payload }, { put }) {
      let effectedRecord = payload.no
      let arrayProd = payload.listItem
      arrayProd.splice(effectedRecord,1)
      let ary = []
      for (let n = 0; n < arrayProd.length; n += 1) {
        ary.push({
          no: n + 1,
          productId: arrayProd[n].productId,
          productCode: arrayProd[n].productCode,
          productName: arrayProd[n].productName,
          qty: arrayProd[n].qty,
          dscription: arrayProd[n].dscription,
        })
      }
      yield put({ type: 'updateState', payload: { listItem: ary, modalVisible: false } })
    },
  },

  reducers: {

    querySuccessTransferOut(state, action) {
      const {
        listSuppliers,
        pagination
      } = action.payload
      return {
        ...state,
        listSuppliers,
        pagination: {
          ...state.pagination,
          ...pagination,
        }
      }
    },
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    resetState(state) {
      const defaultState = {
        listTrans: [],
        listItem: [],
        listStore: [],
        currentItem: {},
        currentItemList: {},
        modalVisible: false,
        searchVisible: false,
        formType: 'add',
        display: 'none',
        activeKey: '0',
        disable: '',
        pagination: {
          // showSizeChanger: true,
          // showQuickJumper: true,
          showTotal: total => `Total ${total} Records`,
          current: 1,
          total: null,
          pageSize: 5
        }
      }
      return {
        ...state,
        ...defaultState
      }
    }
  },
})

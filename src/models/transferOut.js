import modelExtend from 'dva-model-extend'
import {
  query,
  add
} from '../services/transferStockOut'
import {
  query as querySequence,
  increase as increaseSequence,
  increase
} from '../services/sequence'
import {
  pageModel
} from './common'
import {
  message
} from 'antd'

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
    setup({
      dispatch,
      history
    }) {
      history.listen((location) => {
        if (location.pathname === '/inventory/transfer/out') {
          dispatch({
            type: 'querySequence',
            payload: {
              seqCode: 'MUOUT',
              type: 1 // diganti dengan StoreId
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
    * query({
      payload = {}
    }, {
      call,
        put
    }) {
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
    * querySequence({
      payload
    }, {
      call,
        put
    }) {
      yield put({
        type: 'resetState'
      })
      const data = yield call(querySequence, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: {
              transNo: data.data
            }
          }
        })
      } else {
        throw data
      }
    },
    * add({
      payload
    }, {
      call,
        put
    }) {
      const sequenceData = {
        seqCode: 'MUOUT',
        type: 1 // diganti dengan StoreId
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
        let increase = yield call(increaseSequence, sequenceData.seqCode)
        if (!increase.success) {
          error(increaseSequence)
        }
        yield put({
          type: 'modalHide'
        })
        setInterval(function () { location.reload() }, 1000);
        // yield put({
        //   type: 'querySequence',
        //   payload: sequenceData
        // })
        // yield put({ type: 'query' })
      } else {
        error(data)
        throw data
      }
    },
    // * delete({ payload }, { call, put, select }) {
    //     const data = yield call(remove, { id: payload })
    //     const { selectedRowKeys } = yield select(_ => _.suppliers)
    //     if (data.success) {
    //         yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
    //         yield put({ type: 'query' })
    //     } else {
    //         throw data
    //     }
    // },
    // * deleteBatch({ payload }, { call, put }) {
    //     const data = yield call(remove, payload)
    //     if (data.success) {
    //         yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
    //         yield put({ type: 'query' })
    //     } else {
    //         throw data
    //     }
    // },
    // * edit({ payload }, { select, call, put }) {
    //     const supplierCode = yield select(({ suppliers }) => suppliers.currentItem.supplierCode)
    //     const newSupplier = { ...payload, supplierCode }
    //     const data = yield call(edit, newSupplier)
    //     if (data.success) {
    //         yield put({ type: 'modalHide' })
    //         yield put({ type: 'query' })
    //     } else {
    //         throw data
    //     }
    // },

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
    updateState(state, {
      payload
    }) {
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

import modelExtend from 'dva-model-extend'
import { query, add, queryTransferOut, queryDetail, queryByTrans } from '../services/transferStockOut'
import { query as queryStore } from '../services/store'
import {
  query as querySequence,
  increase as increaseSequence,
  increase
} from '../services/sequence'
import moment from 'moment'
import config from 'config'
import { pageModel } from './common'
import { message } from 'antd'

const success = () => {
  message.success('Transfer process has been saved, waiting for confirmation.')
}
const { prefix } = config
const infoStore = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : null

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
    period: moment(infoStore.startPeriod).format('YYYY-MM'),
    filter: null,
    sort: null,
    listProducts: [],
    listTransOut: [],
    showPrintModal: false,
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
          type: 'updateState',
          payload: {
            modalConfirmVisible: true
          }
        })

        // setInterval(function () { location.reload() }, 1000);
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

    * queryTransferOut ({ payload = {} }, { call, put }) {
      const data = yield call(queryTransferOut, payload)
      if (data) {
        yield put({
          type: 'querySuccessListTransferOut',
          payload: {
            listTransferOut: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total,
            },
          },
        })
      }
    },

    * queryProducts ({ payload = {} }, { call, put }) {
      const data = yield call(queryDetail, payload)
      if (data) {
        yield put({
          type: 'querySuccessProducts',
          payload: data.mutasi,
        })
      }
    },

    * queryByTrans ({ payload = {} }, { call, put }) {
      const data = yield call(queryByTrans, payload)
      if (data) {
        yield put({
          type: 'querySuccessTrans',
          payload: data.mutasi,
        })
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

    querySuccessTransferOut (state, action) {
      const {
        listSuppliers,
        pagination,
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
    querySuccessListTransferOut (state, action) {
      const {
        listTransferOut,
        pagination,
      } = action.payload
      return {
        ...state,
        listTransferOut,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
      }
    },
    querySuccessProducts (state, action) {
      return { ...state, listProducts: action.payload }
    },
    querySuccessTrans (state, action) {
      return { ...state, listTransOut: action.payload }
    },
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    resetState (state) {
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
    },
    onSearch (state, action) {
      const { data, search } = action.payload
      const reg = new RegExp(search, 'gi')
      let transNo
      transNo = data.map((record) => {
        const match = record.transNo.match(reg)
        if (!match) {
          return null
        }
        return {
          ...record,
        }
      }).filter(record => !!record)
      return { ...state, listTransferOut: transNo }
    },
  },
})

import modelExtend from 'dva-model-extend'
import moment from 'moment'
import { Modal, message } from 'antd'
import { configMain, lstorage } from 'utils'
import { query, queryTrans as queryTransIn, queryDetail as queryInDetail, add } from '../services/transferStockIn'
import { query as queryOut, queryDetail as queryOutDetail, queryByTransReceive } from '../services/transferStockOut'
import { query as querySequence } from '../services/sequence'
import { acceptTransOut } from '../services/transferOutAccept'
import { pageModel } from './common'
import { getDateTime } from '../services/setting/time'

const success = () => {
  message.success('Transfer process has been saved, waiting for confirmation.')
}

const error = (err) => {
  message.error(err.message)
}
const { prefix } = configMain

const localDate = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : null
export default modelExtend(pageModel, {
  namespace: 'transferIn',
  state: {
    period: moment(localDate.startPeriod).format('YYYY-MM'),
    printMode: 'default', // default,select
    selectedRowKeys: [],
    transNo: [],
    storeId: [],
    listTrans: [],
    listTransIn: [],
    transHeader: {},
    listTransDetail: [],
    listTransferIn: [],
    listProducts: [],
    listItem: [],
    currentItem: {},
    addItem: {},
    activeTabKey: '0',
    sequenceNumber: '',
    modalVisible: false,
    modalAcceptVisible: false,
    modalConfirmVisible: false,
    searchVisible: false,
    formType: 'add',
    display: 'none',
    activeKey: '0',
    disable: '',
    filter: null,
    sort: null,
    disableButton: false,
    showPrintModal: false,
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `Total ${total} Records`,
      current: 1,
      total: null
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/inventory/transfer/in') {
          dispatch({
            type: 'updateState',
            payload: {
              printMode: 'default',
              selectedRowKeys: []
            }
          })
          // dispatch({
          //   type: 'queryCode',
          //   payload: {
          //     active: 1,
          //     status: 0,
          //     storeIdReceiver: lstorage.getCurrentUserStore()
          //   }
          // })
          dispatch({
            type: 'queryMutasiOut',
            payload: {
              active: 1,
              status: 0,
              storeIdReceiver: lstorage.getCurrentUserStore()
            }
          })
        }
      })
    }
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            listTrans: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 5,
              total: data.total
            }
          }
        })
      }
    },
    * queryModal ({ payload = {} }, { call, put }) {
      const period = payload
      yield put({ type: 'showModal', payload: period })
      yield put({ type: 'setPeriod', payload: period })
      const data = yield call(queryOut, payload)
      const transNo = data.data.map(n => n.transNo)
      const storeId = data.data.map(n => n)
      if (data.data.length > 0) {
        yield put({
          type: 'updateState',
          payload: {
            transNo,
            storeId,
            ...payload
          }
        })
      }
    },
    * queryCode ({ payload = {} }, { call, put }) {
      const { period, ...other } = payload
      const data = yield call(queryOut, other)
      let transNo = []
      let storeId = []
      // yield put({ type: 'resetAll', payload: payload })
      if (data.success) {
        transNo = data.data.map(n => n.transNo)
        storeId = data.data.map(n => n)
        yield put({
          type: 'updateState',
          payload: {
            storeId,
            transNo
          }
        })
      } else {
        Modal.warning({
          title: 'No Data',
          content: 'No data inside storage'
        })
      }
    },

    * editSelected ({ payload = {} }, { select, put }) {
      const { selectedRowKeys, source, resetChild } = payload
      console.log('editSelected', selectedRowKeys)

      yield put({
        type: 'updateState',
        payload: {
          selectedRowKeys
        }
      })
      if (source === 'transferInDetail') {
        const listDetail = yield select(({ transferInDetail }) => transferInDetail.listDetail)
        let listSticker = []
        if (listDetail && listDetail.length > 0 && selectedRowKeys && selectedRowKeys.length > 0) {
          listSticker = listDetail.filter(filtered => selectedRowKeys.includes(filtered.no)).map((item) => {
            return ({
              info: item,
              name: item.productName,
              qty: 1
            })
          })
        }
        if (resetChild) {
          resetChild(listSticker)
        }
      } else {
        let listSticker = []
        const listTransDetail = yield select(({ transferIn }) => transferIn.listTransDetail)
        if (listTransDetail && listTransDetail.length > 0 && selectedRowKeys && selectedRowKeys.length > 0) {
          listSticker = listTransDetail.filter(filtered => selectedRowKeys.includes(filtered.no)).map((item) => {
            return ({
              info: item,
              name: item.productName,
              qty: 1
            })
          })
        }
        if (resetChild) {
          resetChild(listSticker)
        }
      }
    },

    * queryMutasiOut ({ payload = {} }, { call, put }) {
      yield put({ type: 'setPeriod', payload })
      let data = yield call(queryOut, payload)
      if (data.success) {
        yield put({ type: 'hideModal' })
        if ((data.data || []).length > 0) {
          yield put({
            type: 'querySuccessTrans',
            payload: {
              listTrans: data.data,
              start: payload.start,
              end: payload.end,
              pagination: {
                current: Number(payload.page) || 1,
                pageSize: Number(payload.pageSize) || 5,
                total: data.total
              }
            }
          })
          yield put({
            type: 'updateState',
            payload: {
              transNo: data.data.map(n => n.transNo),
              storeId: data.data.map(n => n)
            }
          })
        }
      } else {
        throw data
      }
    },
    * queryTransferIn ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            listTransferIn: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    },
    * queryOutDetail ({ payload = {} }, { call, put }) {
      const { start, end, ...other } = payload
      const sequenceParam = {
        seqCode: 'MUIN',
        type: lstorage.getCurrentUserStore()
      }
      const sequence = yield call(querySequence, sequenceParam)
      const data = yield call(queryByTransReceive, payload)
      let detailParams = {}
      if (data.success) {
        detailParams = {
          ...other,
          storeId: data.mutasi.storeId
        }
      }
      const dataDetail = yield call(queryOutDetail, detailParams)
      if (data.success && dataDetail.success && sequence.success) {
        yield put({
          type: 'updateState',
          payload: {
            sequenceNumber: sequence.data,
            transHeader: data.mutasi,
            listTransDetail: dataDetail.mutasi.map((item, index) => ({ ...item, no: index + 1 })),
            modalAcceptVisible: true
          }
        })
      }
    },
    * add ({ payload }, { call, put }) {
      const sequenceData = {
        seqCode: 'MUIN',
        type: lstorage.getCurrentUserStore() // diganti dengan StoreId
      }
      const date = yield call(getDateTime, {
        id: 'timestamp'
      })
      if (date.success) {
        payload.data.receiveDate = moment(date.data).format('YYYY-MM-DD HH:mm:ss')
        const sequence = yield call(querySequence, sequenceData)
        payload.transNo = sequence.data
        let data = yield call(add, payload)
        if (data.success) {
          success()
          yield put({
            type: 'updateState',
            payload: {
              modalConfirmVisible: true,
              showPrintModal: true
            }
          })
        } else {
          error(data)
          throw data
        }
      }
    },
    * queryProducts ({ payload = {} }, { call, put }) {
      const data = yield call(queryInDetail, payload)
      if (data) {
        yield put({
          type: 'querySuccessProducts',
          payload: data.mutasi
        })
      }
    },
    * queryByTrans ({ payload = {} }, { call, put }) {
      const data = yield call(queryTransIn, payload)
      if (data.mutasi) {
        yield put({
          type: 'updateState',
          payload: {
            listTransIn: data.mutasi
          }
        })
      }
    },
    * acceptTransOut ({ payload }, { call, put }) {
      let response = yield call(acceptTransOut, payload)
      if (response && response.success && response.data) {
        message.success('Accept request has sent')
        yield put({
          type: 'transferIn/queryOutDetail',
          payload
        })
      } else {
        throw response
      }
    }
  },

  reducers: {

    querySuccess (state, action) {
      const { listSuppliers, pagination } = action.payload
      return {
        ...state,
        listSuppliers,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },

    updateState (state, { payload }) {
      return {
        ...state,
        ...payload
      }
    },

    querySuccessTrans (state, action) {
      const { listTrans, start, end, pagination } = action.payload
      return {
        ...state,
        listTrans,
        start,
        end,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },

    querySuccessProducts (state, action) {
      return { ...state, listProducts: action.payload }
    },

    showModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal (state) {
      return { ...state, modalVisible: false }
    },

    resetList (state) {
      return { ...state, listTrans: [] }
    },

    resetAll (state) {
      const defaultState = {
        period: moment(localDate.startPeriod).format('YYYY-MM'),
        transNo: [],
        storeId: [],
        listTrans: [],
        transHeader: {},
        listTransDetail: [],
        listItem: [],
        currentItem: {},
        addItem: {},
        sequenceNumber: '',
        modalVisible: false,
        searchVisible: false,
        formType: 'add',
        pagination: {
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: total => `Total ${total} Records`,
          current: 1,
          total: null
        }
      }
      return { ...state, ...defaultState }
    }
  }
})

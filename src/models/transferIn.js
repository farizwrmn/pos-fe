import modelExtend from 'dva-model-extend'
import moment from 'moment'
import { Modal, message } from 'antd'
import { configMain, lstorage } from 'utils'
import { query, queryTrans as queryTransIn, queryDetail as queryInDetail, add } from '../services/transferStockIn'
import { query as queryOut, queryDetail as queryOutDetail, queryByTransReceive } from '../services/transferStockOut'
import { query as querySequence, increase as increaseSequence } from '../services/sequence'
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
            type: 'queryCode',
            payload: {
              active: 1,
              status: 0
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
      if (data.data.length > 0) {
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
    * queryMutasiOut ({ payload = {} }, { call, put }) {
      yield put({ type: 'setPeriod', payload })
      let data
      try {
        data = yield call(queryOut, payload)
        if (data.success === false) {
          Modal.warning({
            title: 'Something Went Wrong',
            content: 'Please Refresh the page or change params'
          })
        }
      } catch (e) {
        console.log('error', e)
      }

      if (data.success) {
        yield put({ type: 'hideModal' })
        if (data.data.length > 0) {
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
          yield put({ type: 'updateState', payload: { currentItem: {} } })
        } else {
          Modal.warning({
            title: 'No Data',
            content: 'No data inside storage'
          })
        }
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
            listTransDetail: dataDetail.mutasi,
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
        payload.data.receiveDate = moment(date.data).format('YYYY-MM-DD hh:mm:ss')
        const sequence = yield call(querySequence, sequenceData)
        payload.transNo = sequence.data
        let data = yield call(add, payload)
        if (data.success) {
          success()
          let increase = yield call(increaseSequence, sequenceData)
          if (!increase.success) {
            error(increaseSequence)
          }
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

import { message } from 'antd'
import { queryDetail, queryHeader, add, update, cancel } from '../../services/tools/sellprice'
import {
  query as querySequence
} from '../../services/sequence'

const success = (messages) => {
  message.success(messages)
}

export default {

  namespace: 'sellprice',

  state: {
    currentItem: {},
    currentItemList: {},
    listItem: [],
    formType: 'add',
    listTrans: [],
    selectedRowKeys: [],
    activeKey: '0',
    modalProductVisible: false,
    modalVisible: false,
    modalConfirmVisible: false,
    modalAcceptVisible: false,
    modalEditVisible: false,
    modalRoundingVisible: false,
    filter: '',
    sort: '',

    itemCancel: {},
    showPrint: false,
    data: [],
    listDetail: [],
    listAmount: [],
    listPaymentOpts: [],
    disableConfirm: false,
    modalCancelVisible: false
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/tools/sellprice') {
          dispatch({
            type: 'querySequence'
          })
        }
      })
    }
  },

  effects: {
    * querySequence (payload, { call, put }) {
      const params = {
        seqCode: 'SPH',
        type: 1 // diganti dengan StoreId
      }
      const data = yield call(querySequence, params)
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
        throw (data)
      }
    },
    * queryHeader ({ payload }, { call, put }) {
      const data = yield call(queryHeader, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listTrans: data.data
          }
        })
      } else {
        throw data
      }
    },
    * queryDetail ({ payload }, { call, put }) {
      const data = yield call(queryDetail, payload)
      if (data.success) {
        for (let n = 0; n < (data.data || []).length; n += 1) {
          data.data[n].no = n + 1
        }
        yield put({
          type: 'updateState',
          payload: {
            listItem: data.data
          }
        })
      } else {
        throw data
      }
    },
    * add ({ payload }, { call, put }) {
      const data = yield call(add, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listItem: [],
            currentItem: {}
          }
        })
        yield put({ type: 'querySequence' })
        success('Changes of sellprice has been save')
      } else {
        yield put({
          type: 'updateState',
          payload: {
            listItem: payload.data || []
          }
        })
        yield put({ type: 'querySequence' })
        throw data
      }
    },
    * update ({ payload }, { call, put }) {
      const data = yield call(update, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listItem: [],
            currentItem: {},
            modalAcceptVisible: false
          }
        })
        yield put({
          type: 'queryHeader',
          payload: {
            status: 0
          }
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            listItem: payload.data || [],
            modalAcceptVisible: false
          }
        })
        yield put({
          type: 'queryHeader',
          payload: {
            status: 0
          }
        })
        throw data
      }
    },
    * cancel ({ payload }, { call, put }) {
      const data = yield call(cancel, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listItem: [],
            currentItem: {},
            modalAcceptVisible: false
          }
        })
        yield put({
          type: 'queryHeader',
          payload: {
            status: 0
          }
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            listItem: payload.data || [],
            modalAcceptVisible: false
          }
        })
        yield put({
          type: 'queryHeader',
          payload: {
            status: 0
          }
        })
        throw data
      }
    },
    * deleteListState ({ payload }, { put }) {
      let effectedRecord = payload.no
      let arrayProd = payload.listItem
      arrayProd.splice(effectedRecord, 1)
      let ary = []
      for (let n = 0; n < arrayProd.length; n += 1) {
        ary.push({
          no: n + 1,
          productId: arrayProd[n].productId,
          productCode: arrayProd[n].productCode,
          productName: arrayProd[n].productName,
          prevSellPrice: arrayProd[n].sellPrice,
          prevDistPrice01: arrayProd[n].distPrice01,
          prevDistPrice02: arrayProd[n].distPrice02,
          prevDistPrice03: arrayProd[n].distPrice03,
          distPrice01: arrayProd[n].distPrice01,
          distPrice02: arrayProd[n].distPrice02,
          distPrice03: arrayProd[n].distPrice03,
          sellPrice: arrayProd[n].sellPrice
        })
      }
      yield put({ type: 'updateState', payload: { listItem: ary, modalVisible: false } })
    }
  },

  reducers: {
    querySuccess (state, { payload }) {
      const { data } = payload
      return {
        ...state,
        data
      }
    },
    updateState (state, { payload }) {
      return { ...state, ...payload }
    }
  }
}

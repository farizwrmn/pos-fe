import modelExtend from 'dva-model-extend'
import { query } from '../../services/transaction/booking'
import { pageModel } from '../common'
import { Modal } from 'antd'
import { config } from 'utils'

export default modelExtend(pageModel, {
  namespace: 'booking',
  state: {
    listTrans: [],
    listItem: [],
    currentItem: {},
    addItem: {},
    newBookingStatus: 'OP',
    focusBookingId: '',
    modalVisible: false,
    modalAcceptVisible: false,
    searchVisible: false,
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/transaction/booking') {

        }
      })
    },
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      try {
        const data = yield call(query, payload)
        if (data.success === false) {
          Modal.warning({
            title: 'Something Went Wrong',
            content: 'Please Refresh the page or change params',
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
            },
          })
          yield put({ type: 'updateState', payload: { currentItem: {} } })
        } else {
          Modal.warning({
            title: 'No Data',
            content: 'No data found with this status',
          })
          yield put({ type: 'resetAll' })
        }
      }
    },
    * queryModal ({ payload = {} }, { call, put }) {
      const period = payload
      yield put({ type: 'showModal', payload: period })
    },
    * focusBookingId ({ payload = {} }, { call, put }) {
      yield put({ type: 'setfocusBooking', payload })
    },
  },

  reducers: {

    querySuccess (state, action) {
      const { listSuppliers, pagination } = action.payload
      return {
        ...state,
        listSuppliers,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
      }
    },

    updateState (state, { payload }) {
      return {
        ...state,
        ...payload,
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
          ...pagination,
        },
      }
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
        listTrans: [],
        listItem: [],
        currentItem: {},
        addItem: {},
        newBookingStatus: 'OP',
        focusBookingId: '',
        modalVisible: false,
        searchVisible: false,
      }
      return { ...state, ...defaultState}
    },

    setfocusBooking (state, { payload }) {
      return { ...state, ...payload }
    },
  },
})

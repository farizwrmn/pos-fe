import modelExtend from 'dva-model-extend'
import { query as queryPos, updatePosHeader, updatePos } from '../services/payment'
import { Modal } from 'antd'
import { pageModel } from './common'
import moment from 'moment'
import config from 'config'

const { prefix } = config
const infoStore = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : null

export default modelExtend(pageModel, {
  namespace: 'maintenance',

  state: {
    item: {},
    modalVisible: false,
    modalType: '',
    optionPos: [],
    listTrans: [],
    listMember: [],
    period: {
      period: moment(infoStore.startPeriod, 'YYYY-MM-DD').format('MM'),
      year: moment(infoStore.startPeriod, 'YYYY-MM-DD').format('YYYY'),
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/maintenance') {
          const infoStore = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : null
          dispatch({
            type: 'queryPos',
            payload: {
              startPeriod: infoStore.startPeriod,
              endPeriod: infoStore.endPeriod
            },
          })
        }
      })
    },
  },

  effects: {

    * queryPos({ payload = {} }, { call, put }) {
      const data = yield call(queryPos, payload)
      let optionSelect = []
      if ((data.data.length || 0) > 0) {
        for (let i = 0; i < data.data.length; i++) {
          optionSelect.push(<Option key={data.data[i].id}>{data.data[i].transNo.toString(36)}</Option>);
        }
        yield put({
          type: 'querySuccess',
          payload: {
            listTrans: data.data,
            optionPos: optionSelect,
            period: {
              period: moment(payload.startPeriod, 'YYYY-MM-DD').format('MM'),
              year: moment(payload.startPeriod, 'YYYY-MM-DD').format('YYYY'),
            }
          },
        })
      } else {
        Modal.warning({
          title: 'Empty Data',
          content: 'No Data in Storage',
        })
      }
    },
    *update({ payload }, { call, put }) {
      const data = yield call(updatePosHeader, payload)
      if (data.success) {
        Modal.info({
          title: 'Information',
          content: 'Transaction has been saved...!',
        })
        const infoStore = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : null
        yield put({
          type: 'queryPos',
          payload: {
            startPeriod: infoStore.startPeriod,
            endPeriod: infoStore.endPeriod
          },
        })
      } else {
        Modal.warning({
          title: 'Warning',
          content: 'Something went wrong...!',
        })
      }
    }
  },

  reducers: {
    querySuccess(state, action) {
      return {
        ...state,
        ...action.payload,
      }
    },
    showModal(state, action) {
      return {
        ...state,
        ...action.payload,
        modalVisible: true
      }
    },
    hideModal(state) {
      return {
        ...state,
        modalVisible: false
      }
    },
    setAllNull(state) {
      return {
        ...state,
        optionPos: [],
        period: {
          period: moment(infoStore.startPeriod, 'YYYY-MM-DD').format('MM'),
          year: moment(infoStore.startPeriod, 'YYYY-MM-DD').format('YYYY'),
        },
        listTrans: []
      }
    },
    setInitialValue(state, action) {
      return { ...state, ...action.payload }
    },
    setItem(state, action) {
      return { ...state }
    }
  },
})
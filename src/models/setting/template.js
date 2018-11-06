import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import { variables } from 'utils'
import { query, edit } from '../../services/setting'
import { pageModel } from './../common'

const success = () => {
  message.success('Setting has been saved')
}
const { getSetting } = variables

export default modelExtend(pageModel, {
  namespace: 'template',

  state: {
    currentItem: {},
    modalType: 'edit',
    activeKey: '0',
    listAccountCode: []
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { activeKey } = location.query
        const { pathname } = location
        if (pathname === '/setting/template') {
          dispatch({
            type: 'setSetting'
          })
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || '0'
            }
          })
          // if (activeKey === '1') dispatch({ type: 'query', payload: other })
        }
      })
    }
  },

  effects: {
    * setSetting (payload, { put }) {
      let settingInvoice = {}
      try {
        settingInvoice = JSON.parse(getSetting('Invoice'))
      } catch (error) {
        console.warn('error invoiceTemplate', error)
      }
      yield put({
        type: 'updateState',
        payload: {
          currentItem: settingInvoice
        }
      })
    },

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data.success) {
        yield put({
          type: 'querySuccessCounter',
          payload: {
            listAccountCode: data.data
          }
        })
      }
    },

    * edit ({ payload }, { call, put }) {
      // return
      const id = payload.id
      const newCounter = {
        data: {
          settingValue: payload.data
        },
        id
      }
      const data = yield call(edit, newCounter)
      if (data.success) {
        success()
        yield put({
          type: 'app/setSetting'
        })
        yield put({
          type: 'updateState',
          payload: {
            currentItem: payload.data
          }
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: payload.data
          }
        })
      }
    }
  },

  reducers: {
    querySuccessCounter (state, action) {
      const { listAccountCode } = action.payload
      return {
        ...state,
        listAccountCode
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
        modalType: 'edit',
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

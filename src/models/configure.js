import modelExtend from 'dva-model-extend'
import { Modal } from 'antd'
import { pageModel } from './common'
import { query, edit } from '../services/setting'

export default modelExtend(pageModel, {
  namespace: 'configure',

  state: {
    formHeader: '',
    formInventoryVisible: false,
    formCompanyVisible: false,
    config: {},
    visibilitySave: 'visible',
    visibilityCommit: 'hidden'
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/setting/configure') {
          dispatch({
            type: 'query',
            payload: {
              formHeader: 'Inventory'
            }
          })
        }
      })
    }
  },

  effects: {
    * query ({ payload = {} }, { call, put }) {
      const setting = yield call(query, { settingCode: payload.formHeader })
      if (setting.success) {
        let json = setting.data[0]
        let jsondata = JSON.stringify(eval(`(${json.settingValue})`))
        const data = JSON.parse(jsondata)
        // JSON.parse(JSON.stringify(eval("(" + getdata + ")")))
        yield put({
          type: `query${payload.formHeader}`,
          payload: {
            ...payload,
            config: data
          }
        })
      }
    },
    * update ({ payload = {} }, { call, put }) {
      const update = yield call(edit, payload = { id: payload.id, data: { settingValue: payload.data } })
      if (update.success) {
        const inventory = yield call(query, { settingCode: payload.formHeader })
        if (inventory.success) {
          let json = inventory.data[0]
          let jsondata = JSON.stringify(eval(`(${json.settingValue})`))
          const data = JSON.parse(jsondata)
          // JSON.parse(JSON.stringify(eval("(" + getdata + ")")))
          yield put({
            type: 'querySettingSuccess',
            payload: {
              ...payload,
              config: data
            }
          })
        }
        Modal.info({
          title: 'Setting has been saved',
          content: 'Reload page to take effect',
          onOk () {
            location = location.href
          },
          onCancel () {
            location = location.href
          }
        })
        yield put({
          type: 'configure/saveVisible',
          payload: {
            visibilitySave: 'visible'
          }
        })
      } else {
        Modal.warning({
          title: 'Warning',
          content: 'Something went wrong please reload page'
        })
        yield put({
          type: 'configure/saveVisible',
          payload: {
            visibilitySave: 'visible'
          }
        })
      }
    }
  },

  reducers: {
    queryInventory (state, action) {
      return { ...state, ...action.payload, formInventoryVisible: true }
    },
    queryCompany (state, action) {
      return { ...state, ...action.payload, formCompanyVisible: true }
    },
    close (state) {
      return { ...state, formInventoryVisible: false, formCompanyVisible: false }
    },
    saveVisible (state, action) {
      return { ...state, visibilityCommit: action.payload.visibilityCommit, visibilitySave: action.payload.visibilitySave }
    }
  }
})

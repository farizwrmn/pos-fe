import modelExtend from 'dva-model-extend'
import { queryUnits, addUnit, removeUnit, editUnit } from '../../services/master/customer'
import { pageModel } from './../common'
import { message } from 'antd'

const success = () => {
  message.success('Customer Unit has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'customerunit',

  state: {
    currentItem: {},
    modalType: 'add',
    display: 'none',
    isChecked: false,
    selectedRowKeys: [],
    activeKey: '0',
    disable: '',
    listUnit: [],
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/master/customerunit') {
          // const payload = location.query
          // dispatch({
          //   type: 'query',
          // })
        }
      })
    },
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(queryUnits, { memberCode: payload.code })
      if (data) {
        yield put({
          type: 'querySuccessUnit',
          payload: {
            listUnit: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total,
            },
          },
        })
      }
    },

    * add ({ payload }, { call, put }) {
      const data = yield call(addUnit, payload)
      if (data.success) {
        // yield put({ type: 'query' })
        success()
      } else {
        throw data
      }
    },

    * delete ({ payload }, { call, put, select }) {
      const data = yield call(removeUnit, { id: payload.policeNo, memberCode: payload.memberCode })
      const { selectedRowKeys } = yield select(_ => _.customer)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'query', payload: { code: payload.memberCode } })
      } else {
        throw data
      }
    },

    * edit ({ payload }, { select, call, put }) {
      const id = yield select(({ customerunit }) => customerunit.currentItem.policeNo)
      const code = yield select(({ customerunit }) => customerunit.currentItem.memberCode)
      const newCustomerUnit = { ...payload, id, code }
      const data = yield call(editUnit, newCustomerUnit)
      if (data.success) {
        yield put({ type: 'query' })
        success()
      } else {
        throw data
      }
    },

  },

  reducers: {
    switchIsChecked (state, display) {
      display = (state.isChecked === true ? 'none' : 'block')
      return { ...state, isChecked: !state.isChecked, display }
    },

    changeTab (state, action) {
      const { pagination } = action.payload
      return { ...state, ...action.payload, pagination: { ...state.pagination, ...pagination } }
    },

    resetItem (state, { payload }) {
      return { ...state, ...payload }
    },

    resetUnit (state) {
      return { ...state, listUnit: [], pagination: { current: '', pageSize: '', total: '' } }
    },

    querySuccessUnit (state, action) {
      const { listUnit, pagination } = action.payload
      return { ...state,
        listUnit,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
      }
    },

  },
})

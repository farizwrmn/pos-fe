import modelExtend from 'dva-model-extend'
import { query } from '../../services/maintenance/healtcheckup'
import { pageModel } from './../common'

export default modelExtend(pageModel, {
  namespace: 'healthcheckup',

  state: {
    currentItem: {},
    unitItem: {},
    modalType: 'add',
    display: 'none',
    isChecked: false,
    selectedRowKeys: [],
    searchText: '',
    activeKey: '0',
    disable: '',
    listUnit: [],
    customerInfo: {},
    listBrand: [],
    listModel: [],
    listType: [],
    listUnitAll: [],
    selected: { brand: {}, model: {}, type: {} },
    pagination: {
      current: 1
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { activeKey, ...other } = location.query
        const { pathname } = location
        if (pathname === '/tools/maintenance/health-checkup') {
          dispatch({
            type: 'getAll',
            payload: other
          })
        }
      })
    }
  },

  effects: {
    * getAll (payload, { call, put }) {
      const data = yield call(query)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listUnitAll: data.data
          }
        })
      } else {
        throw data
      }
    }
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
      return {
        ...state,
        listUnit,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },
    updateState (state, { payload }) {
      return { ...state, ...payload }
    },

    refreshView (state) {
      return {
        ...state,
        modalType: 'add',
        currentItem: {},
        customerInfo: {}
      }
    }

  }
})

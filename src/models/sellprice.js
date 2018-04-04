import modelExtend from 'dva-model-extend'
import { configMain } from 'utils'
import { query } from '../services/sellprice'
import { pageModel } from './common'

const { disableMultiSelect } = configMain

export default modelExtend(pageModel, {
  namespace: 'sellprice',

  state: {
    listSellPrice: [],
    currentItem: {},
    addItem: {},
    modalVisible: false,
    searchVisible: false,
    modalType: 'add',
    selectedRowKeys: [],
    disableMultiSelect,
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
        if (location.pathname === '/master/customertype') {
          dispatch({
            type: 'query',
            payload: location.query
          })
        }
      })
    }
  },

  effects: {

    * query ({ payload }, { call, put }) {
      const data = yield call(query, payload)
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            listSellPrice: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 5,
              // pageSizeOptions: ['5','10','20','50'],
              total: data.total
            }
          }
        })
      }
    }
  },

  reducers: {

    querySuccess (state, action) {
      const { listSellPrice, pagination } = action.payload
      return { ...state,
        listSellPrice,
        pagination: {
          ...state.pagination,
          ...pagination
        } }
    },
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload
      }
    },
    choosePrice (state, action) {
      return { ...state, ...action.payload, visiblePopover: false }
    },
    chooseEmployee (state, action) {
      return { ...state, ...action.payload, visiblePopover: false }
    }
  }
})

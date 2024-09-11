import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import { query, add, addImport, edit, remove } from 'services/pkm/pkmFormula'
import { pageModel } from 'models/common'
import { lstorage } from 'utils'

const success = () => {
  message.success('Pkm formula has been saved')
}

export default modelExtend(pageModel, {
  namespace: 'pkmFormula',

  state: {
    currentItem: {},
    modalType: 'add',
    activeKey: '0',
    list: [],
    modalEditMinorVisible: false,
    modalEditPkmItem: {},
    modalEditPkmVisible: false,
    tmpListProduct: [],
    searchText: '',
    pagination: {
      pageSizeOptions: ['50', '100', '500', '1000'],
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location
        if (pathname === '/stock-pkm') {
          dispatch({ type: 'query' })
        }
      })
    }
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      payload.storeId = lstorage.getCurrentUserStore()
      const response = yield call(query, payload)
      if (response.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: response.data,
            pagination: {
              current: Number(response.page) || 1,
              pageSize: Number(response.pageSize) || 10,
              total: response.total
            }
          }
        })
      }
    },

    * delete ({ payload }, { call, put }) {
      const response = yield call(remove, payload)
      if (response.success) {
        yield put({ type: 'query' })
      } else {
        throw response
      }
    },

    * add ({ payload }, { call, put }) {
      const response = yield call(add, payload.data)
      if (response.success) {
        success()
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {}
          }
        })
        yield put({
          type: 'query'
        })
        if (payload.reset) {
          payload.reset()
        }
      } else {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: payload
          }
        })
        throw response
      }
    },

    * addImport ({ payload }, { call, put }) {
      payload.header = { storeId: payload.storeId }
      const data = yield call(addImport, payload)
      if (data.success) {
        success()
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * edit ({ payload }, { select, call, put }) {
      const id = yield select(({ pkmFormula }) => pkmFormula.modalEditPkmItem.id)
      const list = yield select(({ pkmFormula }) => pkmFormula.list)
      const tmpListProduct = yield select(({ pkmFormula }) => pkmFormula.tmpListProduct)
      const newCounter = { ...payload.data, id }
      const response = yield call(edit, newCounter)
      if (response.success) {
        success()
        const { data } = payload
        yield put({
          type: 'updateState',
          payload: {
            list: list.map((item) => {
              if (id === item.id) {
                item.minor = data.minor
                item.pkm = data.pkm < data.mpkm ? data.mpkm : data.pkm
              }
              return item
            }),
            tmpListProduct: tmpListProduct.map((item) => {
              if (id === item.id) {
                item.minor = data.minor
                item.pkm = data.pkm < data.mpkm ? data.mpkm : data.pkm
              }
              return item
            }),
            modalEditMinorItem: {},
            modalEditMinorVisible: false,
            modalEditPkmItem: {},
            modalEditPkmVisible: false
          }
        })

        if (payload.reset) {
          payload.reset()
        }
      } else {
        throw response
      }
    }
  },

  reducers: {
    querySuccess (state, action) {
      const { list, pagination } = action.payload
      return {
        ...state,
        list,
        tmpListProduct: list,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },

    searchProduct (state, action) {
      const { searchText } = action.payload
      const { tmpListProduct } = state
      const reg = new RegExp(searchText, 'gi')
      let newData
      newData = tmpListProduct.map((record) => {
        const match = record.productCode.match(reg)
          || record.productName.match(reg)
          || (record.categoryName || '').match(reg)
          || (record.departmentName || '').match(reg)
          || (record.subdepartmentName || '').match(reg)
          || (record.brandName || '').match(reg)
        if (!match) {
          return null
        }
        return {
          ...record
        }
      }).filter(record => !!record)

      return { ...state, list: newData }
    },

    updateState (state, { payload }) {
      return { ...state, ...payload }
    },

    changeTab (state, { payload }) {
      const { key } = payload
      return {
        ...state,
        activeKey: key,
        modalType: 'add',
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

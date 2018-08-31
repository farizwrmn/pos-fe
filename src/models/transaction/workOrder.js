import { message } from 'antd'
import {
  queryWOCustomFields, addWOCustomFields, editWOCustomFields, deleteWOCustomFields,
  queryWOCategory, addWOCategory, deleteWOCategory
} from '../../services/transaction/workOrder'

const success = (type) => {
  message.success(`${type} has saved!`)
}

export default {
  namespace: 'workorder',

  state: {
    currentItem: {},
    formType: 'add',
    modalEdit: { visible: false, item: {} },
    listCustomFields: [],
    checkAllCategories: false,
    defaultQueryField: ['id', 'productCategoryId', 'categoryCode', 'categoryName'],
    listWorkOrderCategory: [],
    listWorkOrderCategoryTemp: []
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/master/work-order/custom-fields') {
          dispatch({ type: 'queryWOCustomFields' })
        } else if (location.pathname === '/master/work-order/category') {
          dispatch({ type: 'queryWOCategory' })
        }
      })
    }
  },

  effects: {
    * queryWOCustomFields ({ payload = {} }, { call, put }) {
      const data = yield call(queryWOCustomFields, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listCustomFields: data.data
          }
        })
      }
    },

    * addWOCustomFields ({ payload = {} }, { call, put }) {
      const data = yield call(addWOCustomFields, payload)
      if (data.success) {
        yield put({ type: 'queryWOCustomFields' })
        yield put({
          type: 'updateState',
          payload: {
            currentItem: {},
            formType: 'add'
          }
        })
        success('Custom Field')
      } else {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: payload
          }
        })
        throw data
      }
    },

    * editWOCustomFields ({ payload = {} }, { select, call, put }) {
      const id = yield select(({ workorder }) => workorder.currentItem.id)
      const data = yield call(editWOCustomFields, { id, data: payload })
      if (data.success) {
        yield put({ type: 'queryWOCustomFields' })
        yield put({
          type: 'updateState',
          payload: {
            currentItem: {},
            formType: 'add'
          }
        })
        success('Custom Field')
      } else {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: {
              id,
              ...payload
            }
          }
        })
        throw data
      }
    },

    * deleteWOCustomFields ({ payload }, { select, call, put }) {
      const list = yield select(({ workorder }) => workorder.listCustomFields)
      const data = yield call(deleteWOCustomFields, payload)
      if (data.success) {
        yield put({
          type: 'successDeleteWOCustomFields',
          payload: {
            id: payload.id,
            list
          }
        })
      } else {
        throw data
      }
    },

    * queryWOCategory (payload, { select, call, put }) {
      let field = yield select(({ workorder }) => workorder.defaultQueryField)
      field = field.join(',')
      const data = yield call(queryWOCategory, { field, type: 'all' })
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listWorkOrderCategory: data.data,
            listWorkOrderCategoryTemp: data.data
          }
        })
      }
    },

    * saveWOCategory ({ payload }, { select, put }) {
      let defaultWOCategories = yield select(({ workorder }) => workorder.listWorkOrderCategory)
      for (let x in defaultWOCategories) {
        let available = payload.find(item => item.productCategoryId === defaultWOCategories[x].productCategoryId)
        if (!available) {
          yield put({
            type: 'deleteWOCategory',
            payload: {
              id: defaultWOCategories[x].id
            }
          })
        }
      }
      for (let x in payload) {
        let available = defaultWOCategories.find(item => item.productCategoryId === payload[x].productCategoryId)
        if (!available) {
          yield put({
            type: 'addWOCategory',
            payload: {
              productCategoryId: payload[x].productCategoryId
            }
          })
        }
      }
      success('Categories')
    },

    * addWOCategory ({ payload }, { call }) {
      const data = yield call(addWOCategory, payload)
      if (data.success) {
        console.log(data.data.id)
      } else {
        throw data
      }
    },

    * deleteWOCategory ({ payload }, { call }) {
      const data = yield call(deleteWOCategory, payload)
      if (data.success) {
        console.log(data.message)
      } else {
        throw data
      }
    }
  },

  reducers: {
    updateState (state, { payload }) {
      return { ...state, ...payload }
    },

    successDeleteWOCustomFields (state, { payload }) {
      let { id, list } = payload
      list = list.filter(x => x.id !== id)
      return {
        ...state,
        formType: 'add',
        currentItem: {},
        listCustomFields: list,
        modalEdit: { visible: false, item: {} }
      }
    },

    selectOne (state, { payload }) {
      let { val, record, total } = payload
      record = {
        productCategoryId: record.id,
        categoryCode: record.categoryCode,
        categoryName: record.categoryName
      }
      if (val) {
        state.listWorkOrderCategoryTemp = state.listWorkOrderCategoryTemp.filter(x => x)
        state.listWorkOrderCategoryTemp.push(record)
        if (state.listWorkOrderCategoryTemp.length === total) {
          state.checkAllCategories = true
        }
      } else {
        state.listWorkOrderCategoryTemp = state.listWorkOrderCategoryTemp.filter(x => x.productCategoryId !== record.productCategoryId)
        state.checkAllCategories = false
      }
      return { ...state }
    },

    selectAll (state, { payload }) {
      let { val, list } = payload
      let categories = []
      if (val) {
        for (let key in list) {
          let record = {
            productCategoryId: list[key].id,
            categoryCode: list[key].categoryCode,
            categoryName: list[key].categoryName
          }
          categories.push(record)
        }
      }
      state.listWorkOrderCategoryTemp = categories
      state.checkAllCategories = val
      return { ...state }
    },

    editField (state, { payload }) {
      return {
        ...state,
        currentItem: payload,
        formType: 'edit',
        modalEdit: { visible: false, item: {} }
      }
    },

    showEditModal (state, { payload }) {
      return {
        ...state,
        modalEdit: { visible: !state.modalEdit.visible, item: payload }
      }
    }
  }
}

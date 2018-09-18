import moment from 'moment'
import { message } from 'antd'
import { lstorage } from 'utils'
import {
  queryWOCustomFields, addWOCustomFields, editWOCustomFields, deleteWOCustomFields,
  queryWOCategory, addWOCategory, deleteWOCategory,
  queryWOHeader, addWorkOrderHeader, addWorkOrderDetail
} from '../../services/transaction/workOrder'
import { getDateTime } from '../../services/setting/time'
import { query as querySequence } from '../../services/sequence'
import { queryWoCheck, queryWODetail } from '../../services/transaction/workOrderCheck'

const success = (type) => {
  message.success(`${type} has saved!`)
}

export default {
  namespace: 'workorder',

  state: {
    activeKey: '0',
    formType: 'add',
    start: moment().startOf('month').format('YYYY-MM-DD'),
    end: moment().format('YYYY-MM-DD'),
    q: '',
    modalCustomerVisible: false,
    modalCustomerAssetVisible: false,
    searchText: '',
    modalFilter: false,
    modalAddUnit: false,
    status: [0, 1],
    listWOHeader: [],
    currentStep: 0,
    currentItem: {},
    formMainType: 'add',
    formCustomFieldType: true,
    modalEdit: { visible: false, item: {} },
    listCustomFields: [],
    checkAllCategories: false,
    listWorkOrderCategory: [],
    listWorkOrderCategoryTemp: []
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/master/work-order/custom-fields') {
          dispatch({ type: 'queryWOCustomFields' })
        } else if (location.pathname === '/master/work-order/category') {
          dispatch({
            type: 'queryWOCategory',
            payload: {
              field: 'id,productCategoryId,categoryCode,categoryName'
            }
          })
        } else if (location.pathname === '/transaction/work-order') {
          const { activeKey, ...other } = location.query
          dispatch({
            type: 'updateState',
            payload: {
              activeKey: activeKey || '0'
            }
          })
          if (activeKey !== '1') {
            dispatch({
              type: 'querySequence'
            })
            dispatch({
              type: 'queryWOCategory',
              payload: {
                field: 'id,productCategoryId,categoryCode,categoryName,categoryParentId,categoryParentCode,categoryParentName'
              }
            })
            dispatch({
              type: 'queryWOCustomFields',
              payload: {
                field: 'id,fieldName,sortingIndex,fieldParentId,fieldParentName'
              }
            })
          }
          if (activeKey === '1') {
            dispatch({ type: 'queryWOHeader', payload: other })
          }
        }
      })
    }
  },

  effects: {
    * querySequence ({ payload = {} }, { call, put }) {
      const seqDetail = {
        seqCode: 'WO',
        type: lstorage.getCurrentUserStore(),
        ...payload
      }
      const sequence = yield call(querySequence, seqDetail)
      if (sequence.success) {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: {
              woNo: sequence.data
            }
          }
        })
      }
    },

    * setCheckList ({ payload = {} }, { call, put }) {
      const data = yield call(queryWoCheck, payload)
      const dataField = yield call(queryWODetail, payload)
      if (!dataField.success) {
        throw dataField
      }
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listWorkOrderCategory: data.data,
            listCustomFields: dataField.data,
            listWorkOrderCategoryTemp: [],
            formMainType: 'edit',
            formCustomFieldType: false
          }
        })
        if ((dataField.data || []).length === 0) {
          yield put({
            type: 'queryWOCustomFields',
            payload: {
              field: 'id,fieldName,sortingIndex,fieldParentId,fieldParentName'
            }
          })
          yield put({
            type: 'updateState',
            payload: {
              formCustomFieldType: true // jika belum pernah isi custom field
            }
          })
        }
      } else {
        throw data
      }
    },

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

    * queryWOCategory ({ payload }, { call, put }) {
      const { field } = payload
      const data = yield call(queryWOCategory, { field, type: 'all' })
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listWorkOrderCategory: data.data || [],
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
    },

    * getDate ({ payload }, { select, call, put }) {
      let { start, end, status, ...other } = payload
      let time
      if (!(start && end)) {
        time = yield call(getDateTime, { id: 'date' })
      }
      const defaultStatus = yield select(({ workorder }) => workorder.status)
      yield put({
        type: 'updateState',
        payload: {
          start: start || moment().startOf('month').format('YYYY-MM-DD'),
          end: end || moment(time.data).format('YYYY-MM-DD'),
          status: status || defaultStatus
        }
      })
      start = start || moment().startOf('month').format('YYYY-MM-DD')
      end = end || moment(time.data).format('YYYY-MM-DD')
      yield put({
        type: 'queryWOHeader',
        payload: {
          status: status || defaultStatus,
          transDate: [start, end],
          ...other
        }
      })
    },

    * queryWOHeader ({ payload }, { call, put }) {
      const data = yield call(queryWOHeader, { ...payload })
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listWOHeader: data.data,
            pagination: {
              current: Number(data.page) || 1,
              pageSize: Number(data.pageSize) || 10,
              total: data.total
            }
          }
        })
      } else {
        throw data
      }
    },
    // main work order
    * addWorkOrder ({ payload = {} }, { call, put }) {
      const data = yield call(addWorkOrderHeader, payload)
      if (data.success) {
        yield put({
          type: 'setCheckList',
          payload: {
            woId: data.data.id
          }
        })
        yield put({
          type: 'updateState',
          payload: {
            currentStep: 1,
            currentItem: data.data
          }
        })
        success('Work Order')
      } else {
        throw data
      }
    },
    * addWorkOrderFields ({ payload = {} }, { call, put }) {
      const data = yield call(addWorkOrderDetail, payload)
      if (data.success) {
        yield put({
          type: 'setCheckList',
          payload: {
            woId: data.data.id
          }
        })
        yield put({
          type: 'updateState',
          payload: {
            currentStep: 2,
            formCustomFieldType: false
          }
        })
        success('Work Order Data')
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
    },

    nextStep (state, { payload }) {
      return { ...state, currentStep: payload }
    }
  }
}

import modelExtend from 'dva-model-extend'
import { query, queryField, add, edit, remove } from '../services/units'
import { pageModel } from './common'
import { config } from 'utils'

const { disableMultiSelect } = config

export default modelExtend(pageModel, {
  namespace: 'unit',

  state: {
    listUnit: [],
    listLovMemberUnit: [],
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
      total: null,
    },
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/master/customer') {
          dispatch({
            type: 'query',
            payload: location.query,
          })
        }
      })
    },
  },

  effects: {

    *query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
		          pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 5,
              total: data.total,
            },
            listUnit: data.data,
          },
        })
        // yield put({ type: 'misc/lov' })
        // yield put({ type: 'employee/lovForUser' })
      }
    },

    *'delete' ({ payload }, { call, put, select }) {
      const data = yield call(remove, { id: payload })
      const { selectedRowKeys } = yield select(_ => _.customer)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    *'deleteBatch' ({ payload }, { call, put }) {
      const data = yield call(remove, payload)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    *add ({ payload }, { call, put }) {
      const data = yield call(add, payload)
      if (data.success) {
        yield put({ type: 'modalHide' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    *edit ({ payload }, { select, call, put }) {
      const unit = yield select(({ customer }) => customer.currentItem.policeNo)
      const newUser = { ...payload, unit }
      const data = yield call(edit, newUser)
      if (data.success) {
        yield put({ type: 'modalHide' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    *lov ({ payload }, { call, put }) {
      const data = yield call(queryField, { code: payload.id }, { fields: 'policeNo,merk,model', for: 'pos' })
      if ( data.success ) {
        const dataLov = data.data
        const totalData = data.data.length
        yield put({
          type: 'querySuccessLov',
          payload: {
            listLovMemberUnit: dataLov,
            pagination: {
              total: totalData,
            },
          },
        })

        yield put({
          type: 'pos/chooseMemberUnit',
          payload: { policeNo: data.data[0].policeNo },
        })
      } else {
        console.log('not success')
      }
    },

  },

  reducers: {

    querySuccess (state, action) {
      const { listUnit, pagination } = action.payload
      return { ...state,
        listUnit,
        pagination: {
          ...state.pagination,
          ...pagination,
        } }
    },
    querySuccessLov (state, action) {
      const { listLovMemberUnit, pagination } = action.payload
      return { ...state,
        listLovMemberUnit,
        pagination: {
          ...state.pagination,
          ...pagination,
        } }
    },
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    modalShow (state, { payload }) {
      return { ...state, ...payload, modalVisible: true, disabledItem: { memberCode: true } }
    },
    modalHide (state) {
      return { ...state, modalVisible: false }
    },
    chooseEmployee (state, action) {
      return { ...state, ...action.payload }
    },
    modalPopoverVisible (state, action) {
      return { ...state, ...action.payload, visiblePopover: true }
    },
    modalPopoverClose (state) {
      return { ...state, visiblePopover: false }
    },
    searchShow (state) {
      return { ...state, searchVisible: true }
    },
    searchHide (state) {
      return { ...state, searchVisible: false }
    },
    modalIsEmployeeChange (state, action) {
      return { ...state, ...action.payload,
        disabledItem:{
          customerId: (state.modalType !== 'add' ? !state.disabledItem.customerId : state.disabledItem.customerId),
          getEmployee: !state.disabledItem.getEmployee,
        },
      }
    },
  },
})

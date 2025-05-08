import { message } from 'antd'
import modelExtend from 'dva-model-extend'
import { query, add, edit, remove, totp } from '../../services/users'
import { pageModel } from '../common'

// INSERT INTO dmi_pos_local.tbl_user_role
// (id, userId, userRole, createdAt, createdBy, updatedAt, updatedBy)
// VALUES(4, 'ownerPOS', 'REP', '2017-10-11 09:04:35.000', 'ownerPOS', '2017-10-11 09:04:35.000', '---');


export default modelExtend(pageModel, {
  namespace: 'user',

  state: {
    list: [],
    currentItem: {},
    activeTab: '1',
    addItem: {},
    modalVisible: false,
    searchVisible: false,
    modalType: 'add',
    selectedRowKeys: [],
    totpChecked: false,
    totp: { key: '', url: '', isTotp: false }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/setting/user') {
          dispatch({
            type: 'query',
            payload: location.query
          })
        }
      })
    }
  },

  effects: {

    * query ({ payload = {} }, { select, call, put }) {
      const { current, pageSize } = yield select(({ user }) => user.pagination)
      const newPayload = {
        page: current,
        pageSize,
        ...payload
      }
      const data = yield call(query, newPayload)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            pagination: {
              current: Number(newPayload.page) || 1,
              pageSize: Number(newPayload.pageSize) || 5,
              total: data.total
            }
          }
        })
        yield put({ type: 'misc/lov', payload: { code: 'USERROLE' } })
        yield put({ type: 'employee/lovForUser' })
        // yield put({ type: 'userRole/query' })
      }
    },

    * delete ({ payload }, { call, put, select }) {
      const data = yield call(remove, { id: payload })
      const { selectedRowKeys } = yield select(models => models.user)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * deleteBatch ({ payload }, { call, put }) {
      const data = yield call(remove, payload)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * add ({ payload }, { call, put }) {
      const data = yield call(add, { id: payload.id, data: payload.data })
      if (data.success) {
        yield put({ type: 'query' })
        message.success('Data has been saved')
        yield put({
          type: 'userRole/query',
          payload: { userId: payload.id }
        })
        yield put({ type: 'userStore/getAllStores', payload: { userId: payload.id } })
        yield put({ type: 'userStore/getAllTargetStores', payload: { userId: payload.id } })
        yield put({ type: 'userStore/getUserStores', payload: { userId: payload.id } })
        yield put({ type: 'userStore/getUserTargetStores', payload: { userId: payload.id } })
      } else {
        throw data
      }
    },

    * edit ({ payload }, { select, call, put }) {
      const userId = yield select(({ user }) => user.currentItem.userId)
      const newUser = { ...payload, userId }
      const data = yield call(edit, newUser)
      yield put({ type: 'activeTab', payload: { activeTab: payload.activeTab } })
      if (data.success) {
        yield put({ type: 'query' })
        message.success('Data has been saved')
        // yield put({ type: 'app/query' })
        yield put({ type: 'userStore/getAllStores', payload: { userId: payload.id } })
        yield put({ type: 'userStore/getAllTargetStores', payload: { userId: payload.id } })
        yield put({ type: 'userStore/getUserStores', payload: { userId: payload.id } })
        yield put({ type: 'userStore/getUserTargetStores', payload: { userId: payload.id } })
        yield put({
          type: 'userRole/query',
          payload: { userId: payload.id }
        })
      } else {
        throw data
      }
    },

    * totp ({ payload = {} }, { call, put }) {
      console.log('mode', payload.mode)
      const mode = payload.mode
      const data = yield call(totp, payload)
      if (data.success) {
        yield put({
          type: 'querySuccessTotp',
          payload: {
            mode,
            totp: {
              key: data.key,
              url: data.otpURL,
              isTotp: data.isTOTP
            }
          }
        })
      }
    }
  },

  reducers: {

    querySuccess (state, action) {
      const { list, pagination } = action.payload
      return {
        ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },
    querySuccessTotp (state, action) {
      const { totp, mode } = action.payload
      // if (mode === 'load') state.totpChecked = false
      // console.log('querySuccessTotp', state.totpChecked)
      // console.log('querySuccessTotpv', totp)
      if (mode === 'load') state.totpChecked = totp.isTotp
      return {
        ...state,
        totp
      }
    },
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload
      }
    },
    modalShow (state, { payload }) {
      return { ...state, ...payload, modalVisible: true, disabledItem: { userId: false } }
    },
    modalHide (state) {
      return { ...state, modalVisible: false, currentItem: {}, activeTab: '1' }
    },
    chooseEmployee (state, action) {
      return { ...state, ...action.payload, visiblePopover: false }
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
      return {
        ...state,
        ...action.payload,
        disabledItem: {
          userId: (state.modalType !== 'add' ? !state.disabledItem.userId : state.disabledItem.userId),
          getEmployee: !state.disabledItem.getEmployee
        }
      }
    },
    activeTab (state, { payload }) {
      return {
        ...state,
        ...payload
      }
    }
  }
})

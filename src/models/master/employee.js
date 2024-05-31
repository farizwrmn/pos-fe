import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import { routerRedux } from 'dva/router'
import {
  registerEmployeeFingerprint
} from 'services/fingerprint/fingerprintEmployee'
import moment from 'moment'
import { lstorage } from 'utils'
import { query, queryField, add, edit, remove, getReportCheckin } from '../../services/master/employee'
import { query as querySequence } from '../../services/sequence'
import { pageModel } from './../common'

const success = (id) => {
  message.success(`Employee ${id} has been saved`)
}

export default modelExtend(pageModel, {
  namespace: 'employee',

  state: {
    list: [],
    listHris: [],
    from: undefined,
    to: undefined,
    period: moment().format('MM'),
    year: moment().format('YYYY'),
    listLovEmployee: [],
    currentItem: {},
    modalType: 'add',
    display: 'none',
    isChecked: false,
    selectedRowKeys: [],
    activeKey: '0',
    sequence: '',
    disable: '',
    show: 1
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const {
          activeKey,
          from,
          to
        } = location.query
        const { pathname } = location
        switch (pathname) {
          case '/master/employee':
            if (!activeKey) dispatch({ type: 'refreshView' })
            dispatch({ type: 'querySequenceEmployee' })
            dispatch({
              type: 'updateState',
              payload: {
                activeKey: activeKey || '0'
              }
            })
            if (activeKey === '1') dispatch({ type: 'query' })
            console.log('activeKey', activeKey)

            if (activeKey === '2') {
              dispatch({
                type: 'getCheckinReport',
                payload: {
                  from,
                  to
                }
              })
            }
            break
          case '/report/hris/employee-checkin':
            dispatch({ type: 'querySequenceEmployee' })
            dispatch({
              type: 'updateState',
              payload: {
                activeKey: activeKey || '0'
              }
            })
            if (activeKey === '0') {
              dispatch({
                type: 'getCheckinReport',
                payload: {
                  from,
                  to
                }
              })
            }
            break
          case '/report/service/history':
            dispatch({
              type: 'query'
            })
            break
          case '/tools/sellprice':
            dispatch({
              type: 'query'
            })
            break
          case '/master/division':
            dispatch({
              type: 'query'
            })
            break
          default:
        }
      })
    }
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total
            }
          }
        })
      }
    },

    * querySequenceEmployee ({ payload = {} }, { call, put }) {
      const seqDetail = {
        seqCode: 'EMP',
        type: 1
      }
      const sequence = yield call(querySequence, seqDetail)
      if (sequence.success) {
        yield put({ type: 'updateState', payload: { sequence: sequence.data, ...payload } })
      }
    },

    * delete ({ payload }, { call, put, select }) {
      const data = yield call(remove, { id: payload })
      const { selectedRowKeys } = yield select(models => models.employee)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * add ({ payload }, { call, put }) {
      const seqDetail = {
        seqCode: 'EMP',
        type: 1 // storeId
      }
      const sequence = yield call(querySequence, seqDetail)
      const employeeData = {
        employeeId: sequence.data,
        ...payload.data
      }
      let data = {}
      if (sequence.data !== null) {
        data = yield call(add, { id: sequence.data, data: employeeData })
        if (data.success) {
          success(sequence.data)
          yield put({
            type: 'querySequenceEmployee'
          })
          yield put({
            type: 'updateState',
            payload: {
              modalType: 'add',
              currentItem: {}
            }
          })
        } else {
          let current = Object.assign({}, payload.id, payload.data)
          yield put({
            type: 'updateState',
            payload: {
              currentItem: current
            }
          })
          throw data
        }
      } else {
        console.log('employeeId = ', sequence.data)
        throw data
      }
    },

    * getCheckinReport ({ payload }, { call, put }) {
      const response = yield call(getReportCheckin, payload)
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            listHris: response.data,
            from: payload.from,
            to: payload.to
          }
        })
      } else {
        throw response
      }
    },

    * registerFingerprint ({ payload }, { select, call, put }) {
      const response = yield call(registerEmployeeFingerprint, payload)
      const modalLoginType = yield select(({ pos }) => pos && pos.modalLoginType)
      const modalLoginData = yield select(({ login }) => login && login.modalLoginData)
      if (response.success) {
        if (modalLoginType === 'editPayment'
          || modalLoginType === 'cancelHistory'
          || modalLoginType === 'resetAllPosInput'
          || modalLoginType === 'payment'
          || modalLoginType === 'bundle'
          || modalLoginType === 'service'
          || modalLoginType === 'consignment'
          || modalLoginType === 'resetPaymentPaylabsQRIS') {
          yield put({
            type: 'salesDiscount/add',
            payload: {
              storeId: lstorage.getCurrentUserStore(),
              transType: payload.transType,
              fingerprintId: response.data.id,
              value: modalLoginData
            }
          })
        }
        if (modalLoginType === 'resetAllPosInput'
          || modalLoginType === 'expense'
          || modalLoginType === 'bundle'
          || modalLoginType === 'service'
          || modalLoginType === 'consignment'
          || modalLoginType === 'payment'
          || modalLoginType === 'cancelHistory') {
          yield put({
            type: 'requestCancelPos/queryAdd',
            payload: {
              fingerprintId: response.data.id,
              transNo: modalLoginData.transNo,
              memo: modalLoginData.memo,
              transType: modalLoginData.transType,
              detail: modalLoginData.detail
            }
          })
        }
      } else {
        throw response
      }
    },

    * edit ({ payload }, { select, call, put }) {
      const id = yield select(({ employee }) => employee.currentItem.employeeId)
      const newEmployee = { ...payload, id }
      const data = yield call(edit, newEmployee)
      if (data.success) {
        success(id)
        yield put({
          type: 'updateState',
          payload: {
            modalType: 'add',
            currentItem: {},
            activeKey: '1'
          }
        })
        const { pathname } = location
        yield put(routerRedux.push({
          pathname,
          query: {
            activeKey: '1'
          }
        }))
        yield put({ type: 'query' })
      } else {
        let current = Object.assign({}, payload.id, payload.data)
        yield put({
          type: 'updateState',
          payload: {
            currentItem: current
          }
        })
        throw data
      }
    },
    * lovForUser ({ payload = {} }, { call, put }) {
      const data = yield call(queryField, { fields: 'employeeId,employeeName,email,positionName', for: 'user' })

      if (data.success) {
        const employees = data.data
        const totalData = data.data.length
        yield put({
          type: 'querySuccessEmployee',
          payload: {
            listLovEmployee: employees,
            pagination: {
              total: totalData
            },
            ...payload
          }
        })
      } else {
        console.log('not success')
      }
    }
  },

  reducers: {

    querySuccessEmployee (state, action) {
      const { list, listLovEmployee, pagination } = action.payload
      return {
        ...state,
        listEmployee: list,
        listLovEmployee,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },
    switchIsChecked (state, { payload }) {
      return { ...state, isChecked: !state.isChecked, display: payload }
    },

    changeTab (state, { payload }) {
      return { ...state, ...payload }
    },

    resetItem (state, { payload }) {
      return { ...state, ...payload }
    },

    resetEmployeeList (state) {
      const defaultState = {
        list: [],
        currentItem: {},
        modalType: 'add',
        display: 'none',
        isChecked: false,
        selectedRowKeys: [],
        // activeKey: '0',
        sequence: '',
        disable: '',
        show: 1
      }
      return { ...state, ...defaultState }
    },

    refreshView (state) {
      return {
        ...state,
        modalType: 'add',
        currentItem: {}
      }
    }

  }
})

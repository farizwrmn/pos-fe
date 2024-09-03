import modelExtend from 'dva-model-extend'
import { message, Modal } from 'antd'
import { routerRedux } from 'dva/router'
import { variables } from 'utils'
import { add as addSocial } from '../../services/marketing/customerSocial'
import { query, add, edit, remove } from '../../services/master/customer'
import { query as queryMobile, srvGetMemberStatus, srvActivateMember } from '../../services/mobile/member'
import { query as querySequence } from '../../services/sequence'
import { pageModel } from './../common'

const { reArrangeMember } = variables

const success = () => {
  message.success('Customer has been saved')
}
const activate = (info) => {
  message.success(`Member: ${info.memberCardId} has been activated`)
}

export default modelExtend(pageModel, {
  namespace: 'customer',

  state: {
    currentItem: {},
    dataCustomer: {},
    modalType: 'add',
    display: 'none',
    isChecked: false,
    modalSocialVisible: false,
    selectedRowKeys: [],
    activeKey: '0',
    disable: '',
    searchText: '',
    modalMobile: false,
    listCustomer: [],
    show: 1,
    modalVisible: false,
    listPrintAllCustomer: [],
    showPDFModal: false,
    mode: '',
    changed: false,
    memberCodeDisable: false,
    checkMember: {
      existingCheckBoxDisable: true,
      existingSearchButtonDisable: true,
      confirmCheckBoxDisable: true,
      activateButtonDisable: true,
      confirmCheckBoxCheck: false,
      info: { memberStatus: '|status', memberCode: '' }
    },
    customerLoading: false,
    modalAddUnit: false,
    modalAddMember: false,
    addUnit: { modal: false, info: {} },
    pagination: {
      current: 1
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const { activeKey, ...other } = location.query
        const { pathname } = location
        switch (pathname) {
          case '/master/customerunit':
            dispatch({ type: 'query' })
            dispatch({
              type: 'updateState',
              payload: {
                searchText: ''
              }
            })
            break
          case '/monitor/service/history':
            dispatch({ type: 'query' })
            dispatch({
              type: 'updateState',
              payload: {
                searchText: ''
              }
            })
            break
          case '/report/customer/history':
            dispatch({
              type: 'query'
            })
            dispatch({
              type: 'updateState',
              payload: {
                searchText: ''
              }
            })
            break
          case '/transaction/work-order': {
            const key = !!activeKey
            if (!key || activeKey === '0') {
              dispatch({
                type: 'query'
              })
            }
            break
          }
          case '/master/customer':
            if (!activeKey) {
              dispatch({ type: 'refreshView' })
            }
            if (activeKey === '1') {
              dispatch({ type: 'query', payload: other })
            }
            dispatch({
              type: 'updateState',
              payload: {
                activeKey: activeKey || '0'
              }
            })
            break
          default:
        }
      })
    }
  },

  effects: {
    * checkLengthOfData ({ payload = {} }, { call, put }) {
      yield put({ type: 'showLoading' })
      const data = yield call(query, payload)
      yield put({ type: 'hideLoading' })
      if (data.success) {
        if (data.data.length > 0) {
          Modal.warning({
            title: 'Your Data is too many, please print out with using Excel'
          })
        } else {
          yield put({ type: 'queryAllCustomer', payload: { type: 'all' } })
        }
      }
    },

    * queryAllCustomer ({ payload = {} }, { call, put }) {
      yield put({ type: 'showLoading' })
      const data = yield call(query, payload)
      yield put({ type: 'hideLoading' })
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            listPrintAllCustomer: data.data,
            changed: true
          }
        })
      }
    },

    * queryMember ({ payload = {} }, { call, put }) {
      const data = yield call(queryMobile, payload)
      if (data.success) {
        yield put({
          type: 'updateCurrentItem',
          payload: {
            currentItem: {
              memberCode: data.data.memberCardId,
              memberName: data.data.memberName,
              email: data.data.memberEmail,
              memberCodeDisable: true,
              memberNameDisable: true,
              emailDisable: true
            },
            modalMobile: false
          }
        })
      } else {
        throw data
      }
    },

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
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

    * querySearch ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data) {
        yield put({
          type: 'onSearch',
          payload: {
            list: payload.search === '' ? [] : data.data,
            search: payload.search
          }
        })
      }
    },

    * queryMemberStatus ({ payload = {} }, { call, put }) {
      const result = yield call(srvGetMemberStatus, payload)
      let existingCheckBoxDisable = true
      let confirmCheckBoxDisable = true
      if (result.success) {
        if (result.data) {
          existingCheckBoxDisable = result.data.info.memberStatus.split('|')[0] !== '1'
          confirmCheckBoxDisable = result.data.info.memberStatus.split('|')[0] !== '1'
        } else {
          existingCheckBoxDisable = true
          confirmCheckBoxDisable = true
        }

        yield put({
          type: 'responseMemberStatus',
          payload: {
            checkMember: {
              existingCheckBoxDisable,
              confirmCheckBoxDisable,
              info: result.data.info,
              dataMember: result.data.member,
              dataAsset: result.data.asset,
              dataBooking: result.data.booking
            }
          }
        })
      }
    },
    * enabledItem ({ payload = {} }, { put }) {
      yield put({
        type: 'responseEnabledItem',
        payload
      })
    },
    * activateMember ({ payload = {} }, { call, put }) {
      const result = yield call(srvActivateMember, payload)
      if (result.success) {
        yield put({
          type: 'responseActivateMember',
          payload
        })
        activate(payload)
      } else {
        throw result
      }
    },

    * delete ({ payload }, { call, put, select }) {
      const data = yield call(remove, { id: payload })
      const { selectedRowKeys } = yield select(models => models.customer)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * add ({ payload }, { select, call, put }) {
      const seqDetail = {
        seqCode: 'CUST',
        type: 1 // storeId
      }
      if (payload.data.memberGetDefault) {
        const sequence = yield call(querySequence, seqDetail)
        payload.id = sequence.data
        payload.data.memberCode = sequence.data
        if (!sequence.success) throw sequence
      }
      const data = yield call(add, { id: payload.id, data: payload.data })
      if (data.success) {
        success()
        let listCustomerSocial = yield select(({ customerSocial }) => customerSocial.listCustomerSocial)
        listCustomerSocial = listCustomerSocial.filter(data => data.name !== undefined)
        if (listCustomerSocial.length > 0) {
          yield call(addSocial, { data: listCustomerSocial.map(x => ({ ...x, memberId: data.data.id })) })
        }
        if (payload.modalType === 'add') {
          yield put({
            type: 'updateState',
            payload: {
              modalType: 'add',
              currentItem: {},
              modalAddUnit: true,
              addUnit: {
                modal: false,
                info: { id: payload.id, name: payload.data.memberName }
              }
            }
          })
        } else if (payload.modalType === 'addMember') {
          yield put({
            type: 'updateState',
            payload: {
              modalType: 'add',
              currentItem: {},
              modalAddMember: false
            }
          })
          localStorage.removeItem('member', [])
          localStorage.removeItem('memberUnit')
          const newItem = reArrangeMember(data.data)
          localStorage.setItem('member', JSON.stringify([newItem]))
          yield put({
            type: 'pos/queryGetMemberSuccess',
            payload: { memberInformation: newItem }
          })
          yield put({ type: 'pos/setUtil', payload: { kodeUtil: 'employee', infoUtil: 'Employee' } })
          yield put({ type: 'unit/lov', payload: { id: payload.data.memberCode } })
          yield put({
            type: 'pos/updateState',
            payload: {
              showListReminder: false
            }
          })
          yield put({
            type: 'customer/updateState',
            payload: {
              addUnit: {
                modal: false,
                info: { id: payload.id, name: payload.data.memberName }
              }
            }
          })
        }
        Modal.info({
          title: `You are successfully added member with member code = ${payload.data.memberCode}`
        })
      } else {
        const { memberCode, ...other } = payload.data
        let current = Object.assign({}, { memberCode: payload.id }, other)
        yield put({
          type: 'updateState',
          payload: {
            currentItem: current
          }
        })
        throw data
      }
    },

    // * activate ({ payload }, { call, put }) {
    //   const data = yield call(activate, payload)
    //   if (data.success) {
    //     yield put({
    //       type: 'updateState',
    //       payload: {
    //         dataCustomer: {}
    //       }
    //     })
    //     success()
    //   } else {
    //     throw data
    //   }
    // },

    * edit ({ payload }, { select, call, put }) {
      const id = yield select(({ customer }) => customer.currentItem.memberCode)
      const memberId = yield select(({ customer }) => customer.currentItem.id)
      let listCustomerSocial = yield select(({ customerSocial }) => customerSocial.listCustomerSocial)
      listCustomerSocial = listCustomerSocial.filter(data => data.name !== undefined)
      if (listCustomerSocial.length > 0) {
        yield call(addSocial, { data: listCustomerSocial.map(data => ({ ...data, memberId })) })
      }

      let newCustomer = { ...payload, id }
      if (!id) newCustomer = { ...payload }
      const data = yield call(edit, newCustomer)
      if (data.success) {
        success()
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
    }
  },

  reducers: {
    confirmAddUnit (state) { return { ...state, modalAddUnit: true } },

    showLoading (state) { return { ...state, customerLoading: true } },

    hideLoading (state) { return { ...state, customerLoading: false } },

    cancelSendUnit (state) {
      return {
        ...state, modalAddUnit: false, addUnit: { modal: false, info: {} }
      }
    },

    querySuccess (state, action) {
      const { list, pagination } = action.payload
      return {
        ...state,
        list,
        listCustomer: list,
        dataCustomer: {},
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },

    updateCurrentItem (state, { payload }) {
      const current = {
        ...state.currentItem,
        ...payload.currentItem
      }
      return {
        ...state, currentItem: current
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

    resetCustomerList (state) {
      return { ...state, list: [], pagination: { total: 0 } }
    },

    onSearch (state, action) {
      const { data, search } = action.payload
      const reg = new RegExp(search, 'gi')
      let customerData
      if (search.length > 0) {
        customerData = data.map((record) => {
          const match = record.memberName.match(reg) || record.memberCode.match(reg) || record.address01.match(reg) || record.mobileNumber.match(reg)
          if (!match) {
            return null
          }
          return {
            ...record
          }
        }).filter(record => !!record)
      } else {
        customerData = []
      }
      return { ...state, listCustomer: customerData }
    },

    responseMemberStatus (state, action) {
      const { checkMember } = action.payload
      checkMember.existingSearchButtonDisable = state.checkMember.existingSearchButtonDisable
      checkMember.activateButtonDisable = state.checkMember.activateButtonDisable
      return {
        ...state,
        checkMember
      }
    },
    responseEnabledItem (state, action) {
      if (action.payload.mode === 'existing') {
        state.checkMember.existingSearchButtonDisable = action.payload.state
      } else if (action.payload.mode === 'confirm') {
        state.checkMember.activateButtonDisable = action.payload.state
        state.checkMember.confirmCheckBoxCheck = !action.payload.state
      }
      return {
        ...state
      }
    },
    responseActivateMember (state) {
      state.checkMember = {
        existingCheckBoxDisable: true,
        existingSearchButtonDisable: true,
        confirmCheckBoxDisable: true,
        activateButtonDisable: true,
        confirmCheckBoxCheck: false,
        info: { memberStatus: '|status', memberCode: '' },
        memberStatus: ''
      }
      return {
        ...state
      }
    },

    updateState (state, { payload }) {
      return { ...state, ...payload }
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

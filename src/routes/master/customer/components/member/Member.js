import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import FormCustomer from './FormCustomer'

const Member = ({
  item,
  customer,
  modalType,
  cancelMember,
  customergroup,
  customertype,
  city,
  misc,
  dispatch
}) => {
  const { memberCodeDisable } = customer
  const { listGroup } = customergroup
  const { listType } = customertype
  const { listCity } = city
  const { listLov, code } = misc
  const listIdType = listLov && listLov[code] ? listLov[code] : []

  const formCustomerProps = {
    item,
    memberCodeDisable,
    modalType,
    cancelMember,
    listGroup,
    listType,
    listCity,
    listIdType,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (id, data, modalType) {
      dispatch({
        type: `customer/${modalType}`,
        payload: {
          id,
          data,
          modalType
        }
      })
    },
    confirmSendMember (id, data, modalType) {
      dispatch({
        type: 'customer/add',
        payload: {
          id,
          data,
          modalType
        }
      })
      dispatch({
        type: 'pos/queryGetMemberSuccess',
        payload: { memberInformation: data }
      })
      dispatch({ type: 'pos/setUtil', payload: { kodeUtil: 'mechanic', infoUtil: 'Mechanic' } })
      dispatch({ type: 'unit/lov', payload: { id: data.memberCode } })
      dispatch({
        type: 'pos/updateState',
        payload: {
          showListReminder: false
        }
      })
      dispatch({
        type: 'customer/updateState',
        payload: {
          addUnit: {
            modal: false,
            info: { id, name: data.memberName }
          }
        }
      })
    },
    onCancel () {
      const { pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          activeKey: '1'
        }
      }))
      dispatch({
        type: 'customer/updateState',
        payload: {
          currentItem: {}
        }
      })
    },
    onCancelMobile () {
      dispatch({
        type: 'customer/updateState',
        payload: {
          currentItem: {}
        }
      })
    },
    showCustomerGroup () {
      dispatch({
        type: 'customergroup/query'
      })
    },
    showCustomerType () {
      dispatch({
        type: 'customertype/query'
      })
    },
    showIdType () {
      dispatch({
        type: 'misc/lov',
        payload: {
          code: 'IDTYPE'
        }
      })
    },
    showCity () {
      dispatch({
        type: 'city/query'
      })
    },
    defaultMember (data) {
      dispatch({
        type: 'customer/updateState',
        payload: {
          currentItem: {
            memberCodeDisable: true,
            memberGetDefault: true,
            ...data
          }
        }
      })
    },
    updateCurrentItem (data) {
      dispatch({
        type: 'customer/updateState',
        payload: {
          currentItem: {
            ...data
          }
        }
      })
    },
    showMobileModal (data) {
      dispatch({
        type: 'customer/updateState',
        payload: {
          modalMobile: true,
          currentItem: data
        }
      })
    }
  }
  return (
    <FormCustomer {...formCustomerProps} />
  )
}

export default connect(({ customer, pos, customergroup, customertype, city, misc }) => ({ customer, pos, customergroup, customertype, city, misc }))(Member)

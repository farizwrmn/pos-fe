import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import FormCustomer from './FormCustomer'

const Member = ({
  loading,
  item,
  customer,
  store,
  modalType,
  cancelMember,
  customergroup,
  customertype,
  city,
  misc,
  dispatch
}) => {
  const { memberCodeDisable } = customer
  const { setting } = store
  const { listGroup } = customergroup
  const { listType } = customertype
  const { listCity } = city
  const { listLov, code } = misc
  const listIdType = listLov && listLov[code] ? listLov[code] : []

  const formCustomerProps = {
    item,
    memberCodeDisable,
    setting,
    modalType,
    cancelMember,
    listGroup,
    listType,
    listCity,
    listIdType,
    loading,
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
    defaultMember () {
      dispatch({
        type: 'customer/updateState',
        payload: {
          memberCodeDisable: !memberCodeDisable
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

export default connect(({ customer, store, pos, customergroup, customertype, city, misc }) => ({ customer, store, pos, customergroup, customertype, city, misc }))(Member)

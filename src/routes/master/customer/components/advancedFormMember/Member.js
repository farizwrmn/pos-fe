import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Modal } from 'antd'
import AdvancedForm from './AdvancedForm'

const Member = ({
  item,
  customer,
  store,
  modalType,
  cancelMember,
  customergroup,
  customertype,
  customerSocial,
  city,
  misc,
  social,
  dispatch
}) => {
  const { listCustomerSocial } = customerSocial
  const { memberCodeDisable, modalSocialVisible } = customer
  const { listSocial } = social
  const { setting } = store
  const { listGroup } = customergroup
  const { listType } = customertype
  const { listCity } = city
  const { listLov, code } = misc
  const listIdType = listLov && listLov[code] ? listLov[code] : []

  const modalSocialProps = {
    width: '700px',
    okText: 'Save',
    listSocial,
    listCustomerSocial,
    title: 'Social Media',
    visible: modalSocialVisible,
    addNewRow (data) {
      data.push({})

      dispatch({
        type: 'customerSocial/updateState',
        payload: {
          listCustomerSocial: data
        }
      })
    },
    onSubmit (data) {
      dispatch({
        type: 'customerSocial/updateState',
        payload: {
          listCustomerSocial: data
        }
      })
      dispatch({
        type: 'customer/updateState',
        payload: {
          modalSocialVisible: false
        }
      })
    },
    onCancel () {
      Modal.confirm({
        title: 'Discard unsaved data',
        content: 'Are you sure ?',
        onOk () {
          dispatch({
            type: 'customer/updateState',
            payload: {
              modalSocialVisible: false
            }
          })
          dispatch({
            type: 'customerSocial/updateState',
            payload: {
              listCustomerSocial
            }
          })
        }
      })
    },
    deleteRow (data, id, index) {
      if (id) {
        dispatch({
          type: 'customerSocial/delete',
          payload: id
        })
      }
      dispatch({
        type: 'customerSocial/deleteItem',
        payload: {
          data,
          index
        }
      })
    }
  }

  const formCustomerProps = {
    listSocial,
    modalSocialProps,
    modalSocialVisible,
    dispatch,
    item,
    memberCodeDisable,
    setting,
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
      dispatch({ type: 'pos/setUtil', payload: { kodeUtil: 'employee', infoUtil: 'Employee' } })
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
      dispatch({
        type: 'customerSocial/updateState',
        payload: {
          listCustomerSocial: []
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
    <AdvancedForm {...formCustomerProps} />
  )
}

Member.propTypes = {
  customerSocial: PropTypes.object.isRequired,
  customer: PropTypes.object.isRequired,
  customergroup: PropTypes.object.isRequired,
  customertype: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
  pos: PropTypes.object.isRequired,
  city: PropTypes.object.isRequired,
  misc: PropTypes.object.isRequired,
  social: PropTypes.object.isRequired
}

export default connect(({ customerSocial, customer, store, pos, customergroup, customertype, city, misc, social }) => ({ customerSocial, customer, store, pos, customergroup, customertype, city, misc, social }))(Member)

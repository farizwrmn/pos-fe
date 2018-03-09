import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Filter from './Filter'
import List from './List'

const History = ({ customerReport, customer, dispatch, app, loading }) => {
  const { modalVisible, listAsset, customerInfo } = customerReport
  const { list } = customer
  const { user, storeInfo } = app
  const modalCustomerProps = {
    customer,
    visible: modalVisible.showCustomer,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onCancel () {
      dispatch({
        type: 'customerReport/updateState',
        payload: {
          modalVisible: {
            showCustomer: false
          }
        }
      })
    }
  }

  const modalChoiceProps = {
    visible: modalVisible.showChoice,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onCancel () {
      dispatch({
        type: 'customerReport/updateState',
        payload: {
          modalVisible: {
            showChoice: false
          }
        }
      })
    }
  }

  const filterProps = {
    customer,
    listAsset,
    user,
    storeInfo,
    customerInfo,
    modalVisible,
    ...modalCustomerProps,
    ...modalChoiceProps,
    openModalCustomer () {
      dispatch({
        type: 'customerReport/updateState',
        payload: {
          modalVisible: {
            showCustomer: true,
            showChoice: false
          }
        }
      })
      dispatch({
        type: 'customer/updateState',
        payload: {
          listCustomer: list
        }
      })
    },
    getAllCustomer () {
      dispatch({ type: 'customerReport/queryCustomerAsset' })
      dispatch({
        type: 'customerReport/updateState',
        payload: {
          modalVisible: {
            showChoice: false
          },
          customerInfo: {}
        }
      })
    },
    closeModal () {
      dispatch({
        type: 'customerReport/updateState',
        payload: {
          modalVisible: {
            showCustomer: false,
            showChoice: false
          }
        }
      })
    },
    onResetClick () {
      dispatch({
        type: 'customerReport/updateState',
        payload: {
          customerInfo: {},
          listAsset: []
        }
      })
    },
    onSearchClick () {
      dispatch({
        type: 'customerReport/updateState',
        payload: {
          modalVisible: {
            showChoice: true
          }
        }
      })
    }
  }

  const listProps = {
    dataSource: listAsset,
    loading: loading.effects['customerReport/queryCustomerAsset'],
    style: { marginTop: 15 }
  }

  return (
    <div className="content-inner">
      <Filter {...filterProps} />
      <List {...listProps} />
    </div>
  )
}

History.propTypes = {
  customerReport: PropTypes.object,
  customer: PropTypes.object,
  app: PropTypes.object,
  loading: PropTypes.object,
  dispatch: PropTypes.object
}

export default connect(({ customerReport, customer, app, loading }) => ({ customerReport, customer, app, loading }))(History)


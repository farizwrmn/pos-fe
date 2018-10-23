import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Filter from './Filter'
import List from './List'

const Cashback = ({ customerReport, customer, dispatch, app, loading }) => {
  const { modalVisible, customerInfo, listCashback, from, to } = customerReport
  const { list } = customer
  const { user, storeInfo } = app
  const { showCustomer } = modalVisible
  const modalProps = {
    customer,
    visible: showCustomer,
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

  const printProps = {
    listCashback,
    user,
    storeInfo,
    from,
    to,
    customerInfo
  }

  const filterProps = {
    ...printProps,
    showCustomer,
    customerInfo,
    ...modalProps,
    openModal () {
      dispatch({
        type: 'customerReport/updateState',
        payload: {
          modalVisible: {
            showCustomer: true
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
    onResetClick () {
      dispatch({
        type: 'customerReport/updateState',
        payload: {
          listPoliceNo: [],
          customerInfo: {},
          listHistory: [],
          from: '',
          to: ''
        }
      })
    },
    resetHistory () {
      dispatch({
        type: 'customerReport/updateState',
        payload: {
          listHistory: [],
          listPoliceNo: [],
          from: '',
          to: ''
        }
      })
    },
    onSearchClick (data) {
      dispatch({
        type: 'customerReport/queryCustomerCashbackHistory',
        payload: {
          ...data
        }
      })
    }
  }

  const listProps = {
    dataSource: listCashback,
    loading: loading.effects['customerReport/queryCustomerCashbackHistory'],
    style: { marginTop: 15 }
  }

  return (
    <div className="content-inner">
      <Filter {...filterProps} />
      <List {...listProps} />
    </div>
  )
}

Cashback.propTypes = {
  customerReport: PropTypes.object,
  customer: PropTypes.object,
  service: PropTypes.object,
  app: PropTypes.object,
  loading: PropTypes.object,
  dispatch: PropTypes.object
}

export default connect(({ customerReport, customer, service, app, loading }) => ({ customerReport, customer, service, app, loading }))(Cashback)


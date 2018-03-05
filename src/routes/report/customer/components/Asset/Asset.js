import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Filter from './Filter'
import List from './List'

const History = ({ customerReport, customer, dispatch, app, loading }) => {
  const { modalVisible, listAsset, customerInfo } = customerReport
  const { list } = customer
  const { user, storeInfo } = app
  const modalProps = {
    customer,
    visible: modalVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onCancel () {
      dispatch({
        type: 'customerReport/updateState',
        payload: {
          modalVisible: false
        }
      })
    }
  }

  const filterProps = {
    listAsset,
    user,
    storeInfo,
    customerInfo,
    modalVisible,
    ...modalProps,
    openModal () {
      dispatch({
        type: 'customerReport/updateState',
        payload: {
          modalVisible: true
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
          customerInfo: {}
        }
      })
      dispatch({ type: 'customerReport/queryCustomerAsset' })
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


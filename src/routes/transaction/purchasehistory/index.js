import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import moment from 'moment'
import Filter from './Filter'
import List from './List'
import Modal from './Modal'
import PrintPDF from './PrintPDF'

const PurchaseHistory = ({ purchase, loading, dispatch, location, app }) => {
  const { modalPrintInvoice, period, listPurchaseHistories, purchaseHistory, listPurchaseHistoryDetail } = purchase
  const { user, storeInfo } = app
  const filterProps = {
    period,
    filterChange (date) {
      dispatch({
        type: 'purchase/queryHistory',
        payload: {
          startPeriod: moment(date, 'YYYY-MM').startOf('month').format('YYYY-MM-DD'),
          endPeriod: moment(date, 'YYYY-MM').endOf('month').format('YYYY-MM-DD')
        }
      })
    }
    // filterTransNo (transNo) {
    //   dispatch({
    //     type: 'purchase/queryHistoryByTransNo',
    //     payload: {
    //       transNo
    //     }
    //   })
    // }
  }

  const listProps = {
    dataSource: listPurchaseHistories,
    loading: loading.effects['purchase/queryHistory'],
    location,
    printInvoice (transNo) {
      dispatch({
        type: 'purchase/queryHistoryDetail',
        payload: {
          transNo
        }
      })
    }
  }

  const printProps = {
    user,
    storeInfo,
    invoiceInfo: purchaseHistory,
    invoiceItem: listPurchaseHistoryDetail
  }

  const modalProps = {
    purchaseHistory,
    visible: modalPrintInvoice,
    title: 'Print the Transaction Duplicate?',
    footer: [<PrintPDF {...printProps} />],
    onCancel () {
      dispatch({
        type: 'purchase/updateState',
        payload: {
          modalPrintInvoice: false
        }
      })
    }
  }

  return (
    <div>
      <Filter {...filterProps} />
      <List {...listProps} />
      {modalPrintInvoice && <Modal {...modalProps} />}
    </div>
  )
}

PurchaseHistory.propTypes = {
  purchase: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ purchase, app, loading }) => ({ purchase, app, loading }))(PurchaseHistory)

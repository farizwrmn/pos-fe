import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Input } from 'antd'
import PrintPDF from './PrintPDF'

const Report = ({ purchaseInvoice, dispatch, app }) => {
  const { currentInvoice, invoiceItem } = purchaseInvoice
  const { user, storeInfo } = app

  const getText = (e) => {
    const { value } = e.target
    dispatch({
      type: 'purchaseInvoice/query',
      payload: {
        transNo: value
      }
    })
    dispatch({
      type: 'purchaseInvoice/queryDetail',
      payload: {
        transNo: value
      }
    })
  }

  const printProps = {
    user,
    storeInfo,
    invoiceInfo: currentInvoice,
    invoiceItem
  }
  return (
    <div className="content-inner">
      <Input onBlur={e => getText(e)} />
      <PrintPDF {...printProps} />
    </div>
  )
}

Report.propTypes = {
  dispatch: PropTypes.func,
  app: PropTypes.object,
  purchaseInvoice: PropTypes.object
}

export default connect(({ purchaseInvoice, loading, app }) => ({ purchaseInvoice, loading, app }))(Report)

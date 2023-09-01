import React from 'react'
import enUS from 'antd/lib/locale-provider/en_US'
import moment from 'moment'
import { LocaleProvider } from 'antd'
import { connect } from 'dva'
import styles from './index.less'
import Header from './Header'
import Body from './Body'

class BalanceInvoice extends React.Component {
  render () {
    const { setoran } = this.props
    const { invoice, invoiceSummary } = setoran

    const invoiceInfo = {
      employeeName: invoice.userName,
      dataPos: invoice.detail,
      id: invoice.balanceId,
      userName: invoice.cashierName,
      storeName: invoice.storeName,
      shift: invoice.shiftName,
      openDate: moment(invoice.open).format('DD MMM YYYY, HH:mm:ss'),
      closeDate: moment(invoice.closed).format('DD MMM YYYY, HH:mm:ss')
    }

    const bodyProps = {
      list: invoice.detail,
      invoiceSummary
    }

    return (
      <LocaleProvider locale={enUS}>
        <div className={styles.invoiceMini}>
          <Header invoiceInfo={invoiceInfo} />
          <Body {...bodyProps} />
        </div>
      </LocaleProvider>
    )
  }
}

export default connect(({
  setoran
}) => ({
  setoran
}))(BalanceInvoice)

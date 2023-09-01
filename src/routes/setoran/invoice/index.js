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
    const { setoranInvoice, setoranInvoiceSummary } = setoran

    console.log('setoranInvoice', setoranInvoice)

    const invoiceInfo = {
      employeeName: setoranInvoice.userName,
      dataPos: setoranInvoice.detail,
      id: setoranInvoice.balanceId,
      userName: setoranInvoice.cashierName,
      storeName: setoranInvoice.storeName,
      shift: setoranInvoice.shiftName,
      openDate: moment(setoranInvoice.open).format('DD MMM YYYY, HH:mm:ss'),
      closeDate: moment(setoranInvoice.closed).format('DD MMM YYYY, HH:mm:ss')
    }

    const bodyProps = {
      list: setoranInvoice.detail,
      setoranInvoiceSummary
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

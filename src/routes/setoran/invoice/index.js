import React from 'react'
import enUS from 'antd/lib/locale-provider/en_US'
import moment from 'moment'
import { LocaleProvider } from 'antd'
import { connect } from 'dva'
import styles from './index.less'
import Header from './Header'
import Body from './Body'

class BalanceInvoice extends React.Component {
  state = {
    totalBalanceInput: 0,
    totalBalancePayment: 0,
    totalDiffBalance: 0
  }

  componentDidMount () {
    const { setoran } = this.props
    if (setoran && setoran.setoranInvoice && setoran.setoranInvoice.detail && setoran.setoranInvoice.detail.length > 0) {
      const listDetail = setoran.setoranInvoice.detail
      let totalBalanceInput = 0
      let totalBalancePayment = 0
      let totalDiffBalance = 0
      for (let index in listDetail) {
        const record = listDetail[index]
        totalBalanceInput += record.totalBalanceInput
        totalBalancePayment += record.totalBalancePayment
        totalDiffBalance += record.totalDiffBalance
      }
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({
        totalBalanceInput,
        totalBalancePayment,
        totalDiffBalance
      })
    }
  }

  render () {
    const { setoran } = this.props
    const { setoranInvoice } = setoran

    const invoiceInfo = {
      employeeName: setoranInvoice.userName,
      dataPos: setoranInvoice.detail,
      id: setoranInvoice.balanceId,
      userName: setoranInvoice.cashierName,
      storeName: setoranInvoice.storeName,
      shift: setoranInvoice.shiftName,
      openDate: moment(setoranInvoice.open).format('DD MMM YYYY, HH:mm:ss'),
      closeDate: moment(setoranInvoice.close).format('DD MMM YYYY, HH:mm:ss')
    }

    return (
      <LocaleProvider locale={enUS}>
        <div className={styles.invoiceMini}>
          <Header invoiceInfo={invoiceInfo} />
          <Body list={setoranInvoice.detail} />
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

import { Button, Col, Icon, Row, Spin } from 'antd'
import { Component } from 'react'
import CountdownTimer from './CountDownTimer'

const second = 60

class QrisPayment extends Component {
  state = {
    timeout: false
  }

  render () {
    const { paymentTransaction, cancelQrisPayment, paymentFailed, loading, paymentTransactionLimitTime, refreshPayment } = this.props
    const { timeout } = this.state

    const countDownProps = {
      onTimerFinish: () => {
        paymentFailed()
        this.setState({ timeout: true })
      },
      duration: (paymentTransactionLimitTime + 15) * second
    }

    const timeoutComponent = (
      <div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Spin />
        </div>
        <div style={{ fontSize: '11', color: 'initial' }}>
          Note: Jangan refresh browser jika customer telah membayar
        </div>
      </div>
    )

    return (
      <Row style={{ padding: '0 20px 0 20px' }}>
        <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', fontSize: '24px', marginBottom: '20px  ' }}>
          <div style={{ flex: 1 }}>
            Menunggu Verifikasi Pembayaran
          </div>
          <Icon type="clock-circle-o" style={{ color: '#F7D33C', marginRight: '20px' }} />
        </div>

        <Row><Col span={8}>TransNo: {paymentTransaction.posTransNo}</Col></Row>
        <Row><Col span={8}>TransDate: {paymentTransaction.transDate} {paymentTransaction.transTime}</Col></Row>
        <Row><Col span={8}>Amount: {paymentTransaction.amount}</Col></Row>
        <Col span={24} style={{ color: 'initial', fontWeight: 'bold' }} >
          <Row style={{ marginBottom: '10px' }}>
            Sedang menunggu pembayaran dari pelanggan
            <br />1. jika mengharuskan cancel atau issue, ingat foto inbox atau response berhasil dari customer dengan nomor RRN/reference/issuerReference.
            <br />2. Jika customer telah membayar tetapi tidak masuk ke sistem, arahkan untuk membayar dengan tipe payment yang lain, lalu laporkan ke BCA.
          </Row>
          {timeout ? (
            <Row style={{ marginBottom: '30px', color: '#808080', fontWeight: 'bolder' }}>
              {timeoutComponent}
            </Row>
          ) : [
            <Row style={{ color: '#808080' }}>
              Waktu pembayaran tersisa:
            </Row>,
            <Row style={{ marginBottom: '30px', color: '#808080', fontWeight: 'bolder' }}>
              <CountdownTimer {...countDownProps} />
            </Row>
          ]}
          <Row style={{ display: 'flex', flexDirection: 'row-reverse' }}>
            <Button
              type="danger"
              onClick={cancelQrisPayment}
              size="large"
              style={{ padding: '0 20px 0 20px' }}
              disabled={loading.effects['payment/createDynamicQrisPayment'] || loading.effects['payment/cancelDynamicQrisPayment']}
              loading={loading.effects['payment/createDynamicQrisPayment'] || loading.effects['payment/cancelDynamicQrisPayment']}
            >
              Void Invoice
            </Button>
            <div style={{ flex: 1 }}>
              <Button
                type="primary"
                onClick={refreshPayment}
                size="large"
                style={{ padding: '0 20px 0 20px' }}
                disabled={loading.effects['pos/refreshDynamicQrisPayment'] || loading.effects['payment/cancelDynamicQrisPayment']}
                loading={loading.effects['pos/refreshDynamicQrisPayment'] || loading.effects['payment/cancelDynamicQrisPayment']}
              >
                Get Status (Inquiry)
              </Button>
            </div>
          </Row>
        </Col>
      </Row>
    )
  }
}

export default QrisPayment

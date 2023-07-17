import { Button, Col, Icon, Modal, Row } from 'antd'
import { Component } from 'react'
import CountdownTimer from './CountDownTimer'

let paymentTimeout

class QrisPayment extends Component {
  componentDidMount () {
    const { paymentFailed } = this.props
    // 5 minutes
    const timeoutTime = 5 * 60 * 1000
    paymentTimeout = setTimeout(() => {
      paymentFailed()
    }, timeoutTime)
  }

  componentWillUnmount () {
    clearTimeout(paymentTimeout)
  }

  render () {
    const { cancelQrisPayment, loading } = this.props

    const countDownProps = {
      onTimerFinish: () => {
        Modal.error({
          title: 'Timeout',
          content: 'Waktu pembayaran telah berakhir'
        })
        cancelQrisPayment()
      },
      duration: 5 * 60
    }

    return (
      <Row style={{ padding: '0 20px 0 20px' }}>
        <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', fontSize: '24px', marginBottom: '20px  ' }}>
          <div style={{ flex: 1 }}>
            Menunggu Verifikasi Pembayaran
          </div>
          <Icon type="clock-circle-o" style={{ color: '#F7D33C', marginRight: '20px' }} />
        </div>
        <Col span={24} style={{ fontSize: '20px' }} >
          <Row style={{ marginBottom: '10px' }}>
            Sedang menunggu pembayaran dari pelanggan
          </Row>
          <Row style={{ fontSize: '15px', color: '#808080' }}>
            Waktu pembayaran tersisa:
          </Row>
          <Row style={{ marginBottom: '30px', fontSize: '15px', color: '#808080', fontWeight: 'bolder' }}>
            <CountdownTimer {...countDownProps} />
          </Row>
          <Row style={{ display: 'flex', flexDirection: 'row-reverse' }}>
            <Button type="danger" onClick={cancelQrisPayment} size="large" style={{ padding: '0 20px 0 20px' }} loading={loading.effects['payment/createDynamicQrisPayment']}>
              Cancel
            </Button>
          </Row>
        </Col>
      </Row>
    )
  }
}

export default QrisPayment

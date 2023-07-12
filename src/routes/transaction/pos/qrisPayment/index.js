import { Button, Col, Icon, Row } from 'antd'
import CountDown from 'ant-design-pro/lib/CountDown'
import { Component } from 'react'

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
    const { cancelQrisPayment } = this.props
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
            <CountDown style={{ fontSize: 20 }} target={new Date().getTime() + (5 * 60 * 1000)} />
          </Row>
          <Row style={{ display: 'flex', flexDirection: 'row-reverse' }}>
            <Button type="danger" onClick={cancelQrisPayment} size="large" style={{ padding: '0 20px 0 20px' }}>
              Cancel
            </Button>
          </Row>
        </Col>
      </Row>
    )
  }
}

export default QrisPayment

import { Button, Col, Icon, Modal, Row } from 'antd'
import { Component } from 'react'
import { lstorage } from 'utils'
import CountdownTimer from './CountDownTimer'

let paymentTimeout

const second = 60
const millisecond = 1000

const {
  removeDynamicQrisTimeLimit
} = lstorage

class QrisPayment extends Component {
  componentDidMount () {
    const { paymentFailed, paymentTransactionLimitTime } = this.props
    // 5 minutes
    const timeoutTime = paymentTransactionLimitTime * second * millisecond
    paymentTimeout = setTimeout(() => {
      paymentFailed()
    }, timeoutTime)
  }

  componentWillUnmount () {
    clearTimeout(paymentTimeout)
    removeDynamicQrisTimeLimit()
  }

  render () {
    const { cancelQrisPayment, loading, paymentTransactionLimitTime } = this.props

    const countDownProps = {
      onTimerFinish: () => {
        Modal.error({
          title: 'Timeout',
          content: 'Waktu pembayaran telah berakhir'
        })
        cancelQrisPayment()
      },
      duration: paymentTransactionLimitTime * second
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

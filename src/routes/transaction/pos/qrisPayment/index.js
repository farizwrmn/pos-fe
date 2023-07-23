import { Button, Col, Icon, Modal, Row, Spin } from 'antd'
import { Component } from 'react'
import CountdownTimer from './CountDownTimer'

const second = 60

class QrisPayment extends Component {
  state = {
    timeout: false
  }

  render () {
    const { cancelQrisPayment, paymentFailed, loading, paymentTransactionLimitTime, refreshPayment } = this.props
    const { timeout } = this.state

    const countDownProps = {
      onTimerFinish: () => {
        Modal.error({
          title: 'Timeout',
          content: 'Waktu pembayaran telah berakhir'
        })
        paymentFailed()
        this.setState({ timeout: true })
      },
      duration: paymentTransactionLimitTime * second
    }

    const timeoutComponent = (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Spin />
        <div style={{ fontSize: '15px', color: '#808080' }}>
          Waiting Response From Server
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
        <Col span={24} style={{ fontSize: '20px' }} >
          <Row style={{ marginBottom: '10px' }}>
            Sedang menunggu pembayaran dari pelanggan
          </Row>
          {timeout ? (
            <Row style={{ marginBottom: '30px', fontSize: '15px', color: '#808080', fontWeight: 'bolder' }}>
              {timeoutComponent}
            </Row>
          ) : [
            <Row style={{ fontSize: '15px', color: '#808080' }}>
              Waktu pembayaran tersisa:
            </Row>,
            <Row style={{ marginBottom: '30px', fontSize: '15px', color: '#808080', fontWeight: 'bolder' }}>
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
              Cancel
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
                Refresh
              </Button>
            </div>
          </Row>
        </Col>
      </Row>
    )
  }
}

export default QrisPayment

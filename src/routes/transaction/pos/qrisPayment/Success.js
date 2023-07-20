import { Button, Col, Icon, Row } from 'antd'

const QrisPaymentSuccess = ({ createPayment, loading }) => {
  return (
    <Row style={{ padding: '0 20px 0 20px' }}>
      <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', fontSize: '24px', marginBottom: '20px  ' }}>
        <div style={{ flex: 1 }}>
          Pembayaran Berhasil
        </div>
        <Icon type="pay-circle-o" style={{ color: '#5AC3BE', marginRight: '20px' }} />
      </div>
      <Col span={24} style={{ fontSize: '20px' }} >
        <Row style={{ marginBottom: '30px' }}>
          Silahkan tekan tombol OK untuk mencetak struk penjualan
        </Row>
        <Row style={{ display: 'flex', flexDirection: 'row-reverse' }}>
          <Button type="primary" onClick={createPayment} disabled={loading.effects['payment/create']} size="large" style={{ padding: '0 20px 0 20px' }} loading={loading.effects['payment/create']}>
            Ok
          </Button>
        </Row>
      </Col>
    </Row>
  )
}

export default QrisPaymentSuccess

import { Button, Col, Row } from 'antd'
import verified from '../../../../../public/gif/verified.gif'

const QrisPaymentSuccess = ({ createPayment, CloseModal, loading }) => {
  return (
    <Row style={{ padding: '0 20px 0 20px' }}>
      <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', fontSize: '24px', marginBottom: '20px  ' }}>
        <div style={{ flex: 1 }}>
          Pembayaran Berhasil
        </div>
        <img src={verified} alt="no_gif" width="100%" height="auto" style={{ maxWidth: '40px', maxHeight: '40px' }} />
      </div>
      <Col span={24} style={{ fontSize: '20px' }} >
        <Row style={{ marginBottom: '30px' }}>
          Silahkan tekan tombol OK untuk mencetak struk penjualan
        </Row>
        <Row style={{ display: 'flex', flexDirection: 'row-reverse' }}>
          <Button
            type="primary"
            onClick={createPayment}
            disabled={loading.effects['payment/create']}
            size="large"
            style={{ padding: '0 20px 0 20px' }}
            loading={loading.effects['payment/create']}
          >
            Invoice
          </Button>
          <Button
            type="ghost"
            onClick={CloseModal}
            size="large"
            style={{ padding: '0 20px 0 20px', marginRight: '20px' }}
          >
            Close
          </Button>
        </Row>
      </Col>
    </Row>
  )
}

export default QrisPaymentSuccess

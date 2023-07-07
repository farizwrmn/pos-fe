import { Button, Col, Icon, Row } from 'antd'

const QrisPaymentFailed = ({ cancelQrisPayment }) => {
  return (
    <Row style={{ padding: '0 20px 0 20px' }}>
      <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', fontSize: '24px', marginBottom: '20px  ' }}>
        <div style={{ flex: 1, color: '#EF5656' }}>
          Pembayaran Gagal
        </div>
        <Icon type="frown-o" style={{ color: '#EF5656', marginRight: '20px' }} />
      </div>
      <Col span={24} style={{ fontSize: '20px' }} >
        <Row style={{ marginBottom: '30px' }}>
          Maaf, Sistem belum menerima pembayaran dari pelanggan.
          Silahkan coba kembali atau pakai metode pembayaran lain.
        </Row>
        <Row style={{ display: 'flex', flexDirection: 'row-reverse' }}>
          <Button type="danger" onClick={cancelQrisPayment} size="large" style={{ padding: '0 20px 0 20px' }}>
            Kembali
          </Button>
        </Row>
      </Col>
    </Row>
  )
}

export default QrisPaymentFailed

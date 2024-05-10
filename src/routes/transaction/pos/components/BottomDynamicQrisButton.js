import React from 'react'
import { Row, Col, Button } from 'antd'

const DynamicQrisButton = ({
  handleDynamicQrisButton,
  loading
}) => {
  return (
    <Row style={{ marginTop: '60px' }}>
      <Col span={24} >
        <Button
          style={{
            fontWeight: 400,
            fontSize: 'large',
            width: '100%',
            height: 40
          }}
          type="ghost"
          icon="qrcode"
          onClick={handleDynamicQrisButton}
          loading={loading.effects['pos/checkPaymentTransactionInvoice'] || loading.effects['payment/createDynamicQrisPayment'] || loading.effects['payment/cancelDynamicQrisPayment']}
          disabled={loading.effects['pos/checkPaymentTransactionInvoice'] || loading.effects['payment/createDynamicQrisPayment'] || loading.effects['payment/cancelDynamicQrisPayment']}
        >
          Dynamic QRIS
        </Button>
      </Col>
    </Row>
  )
}

export default DynamicQrisButton

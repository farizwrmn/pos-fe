import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Button } from 'antd'

const LovButton = ({
  handlePayment,
  handleCancel
}) => {
  return (
    <div>
      <Row>
        <Col md={24} lg={6}>
          <Button
            style={{ fontWeight: 400, fontSize: 'large', width: '100%', height: 40 }}
            type="danger"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </Col>
        <Col md={24} lg={18} >
          <Button
            style={{
              fontWeight: 400,
              fontSize: 'large',
              width: '100%',
              height: 40
            }}
            type="primary"
            onClick={handlePayment}
          >
            Payment
          </Button>
        </Col>
      </Row>
    </div>
  )
}

LovButton.propTypes = {
  handlePayment: PropTypes.func.isRequired
}

export default LovButton

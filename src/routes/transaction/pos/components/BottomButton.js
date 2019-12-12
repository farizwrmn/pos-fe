import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Button } from 'antd'

const LovButton = ({
  handlePayment,
  handleSuspend,
  handleCancel
}) => {
  return (
    <div>
      <Button
        style={{
          fontWeight: 400,
          fontSize: 'large',
          width: '100%',
          height: 40,
          color: '#000000',
          background: '#8fc9fb'
        }}
        onClick={handlePayment}
      >
        Payment
      </Button>
      <Row>
        <Col md={24} lg={12} >
          <Button
            style={{ fontWeight: 400, fontSize: 'large', width: '100%', height: 40, color: '#000000', background: '#ffff66' }}
            onClick={handleSuspend}
          >
            Suspend
          </Button>
        </Col>
        <Col md={24} lg={12}>
          <Button
            style={{ fontWeight: 400, fontSize: 'large', width: '100%', height: 40 }}
            type="danger"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </Col>
      </Row>
    </div>
  )
}

LovButton.propTypes = {
  handlePayment: PropTypes.func.isRequired,
  handleSuspend: PropTypes.func.isRequired
}

export default LovButton

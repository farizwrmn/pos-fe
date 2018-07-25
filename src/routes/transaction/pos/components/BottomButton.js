import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Button } from 'antd'

const LovButton = ({
  handlePayment,
  handleSuspend,
  handleVoidPromo
}) => {
  return (
    <div>
      <Row>
        <Col span={12} style={{ padding: '12 0' }}>
          <Row>
            <Col xs={24} sm={24} md={16} lg={16} xl={18}>
              <Button
                style={{ fontWeight: 400, fontSize: 'large', width: '200%', height: 40, color: '#000000', background: '#8fc9fb' }}
                className="margin-right"
                width="100%"
                onClick={handlePayment}
              >
                Payment
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col span={12} style={{ padding: '12 0' }}>
          <Row>
            <Col xs={24} sm={24} md={16} lg={10} xl={8}>
              <Button
                style={{ fontWeight: 400, fontSize: 'large', width: '100%', height: 40, color: '#000000', background: '#ffff66' }}
                onClick={handleSuspend}
              >
                Suspend
              </Button>
            </Col>
            <Col xs={24} sm={24} md={16} lg={10} xl={8}>
              <Button
                style={{ fontWeight: 400, fontSize: 'large', width: '100%', height: 40 }}
                type="danger"
                onClick={handleVoidPromo}
              >
                Void Promo
              </Button>
            </Col>
          </Row>
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

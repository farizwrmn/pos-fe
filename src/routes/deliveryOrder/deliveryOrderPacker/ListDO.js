import React from 'react'
import { Row, Col } from 'antd'

const columnProps = {
  md: 12,
  lg: 6
}

const ListDO = ({ currentItem }) => {
  return (
    <div>
      <div>
        <Row>
          <Col {...columnProps}>
            <h3>Trans No.</h3>
          </Col>
          <Col {...columnProps}>
            <strong>{currentItem.transNo}</strong>
          </Col>
        </Row>

        <Row>
          <Col {...columnProps}>
            <h3>From</h3>
          </Col>
          <Col {...columnProps}>
            <h3>{currentItem.storeName}</h3>
          </Col>
        </Row>

        <Row>
          <Col {...columnProps}>
            <h3>To</h3>
          </Col>
          <Col {...columnProps}>
            <h3>{currentItem.storeNameReceiver}</h3>
          </Col>
        </Row>

        <Row>
          <Col {...columnProps}>
            <h3>Date</h3>
          </Col>
          <Col {...columnProps}>
            <h3>{currentItem.transDate}</h3>
          </Col>
        </Row>

        <Row>
          <Col {...columnProps}>
            <h3>Expired DO</h3>
          </Col>
          <Col {...columnProps}>
            <span />
          </Col>
        </Row>

        <Row>
          <Col {...columnProps}>
            <h3>Description</h3>
          </Col>
          <Col {...columnProps}>
            <h3>{currentItem.description}</h3>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default ListDO

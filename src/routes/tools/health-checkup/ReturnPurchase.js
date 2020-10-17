import React from 'react'
import { Col, Row } from 'antd'
import { numberFormatter } from 'utils/numberFormat'

const ReturnPurchase = ({ listUnitAll }) => {
  return (
    <div>
      {listUnitAll.ReturnPurchase && listUnitAll.ReturnPurchaseJurnal && (
        <div>
          <Row>
            <Col span="6">ReturnPurchase:</Col>
            <Col span="18">{numberFormatter(listUnitAll.ReturnPurchase.summary)}</Col>
          </Row>
          <Row>
            <Col span="6" />
            <Col span="18">{numberFormatter(listUnitAll.ReturnPurchaseJurnal.summary)}</Col>
          </Row>
        </div>
      )}
    </div>
  )
}

export default ReturnPurchase

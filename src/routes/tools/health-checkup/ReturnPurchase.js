import React from 'react'
import { Col, Row } from 'antd'
import { numberFormatter } from 'utils/numberFormat'
import { Link } from 'dva/router'

const ReturnPurchase = ({ listUnitAll }) => {
  return (
    <div>
      {listUnitAll.ReturnPurchase && listUnitAll.ReturnPurchaseJurnal && (
        <div>
          <Row>
            <Col span="6"><Link to="/report/adjust/purchase">ReturnPurchase:</Link></Col>
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

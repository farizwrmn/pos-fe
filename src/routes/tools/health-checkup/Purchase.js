import React from 'react'
import { Col, Row } from 'antd'
import { numberFormatter } from 'utils/numberFormat'
import { Link } from 'dva/router'

const Purchase = ({ listUnitAll }) => {
  return (
    <div>
      {listUnitAll.Purchase && listUnitAll.PurchaseJurnal && (
        <div>
          <Row>
            <Col span="6"><Link to="/report/purchase/summary">Purchase:</Link></Col>
            <Col span="18">{numberFormatter(listUnitAll.Purchase.summary)}</Col>
          </Row>
          <Row>
            <Col span="6" />
            <Col span="18">{numberFormatter(listUnitAll.PurchaseJurnal.summary)}</Col>
          </Row>
        </div>
      )}
    </div>
  )
}

export default Purchase

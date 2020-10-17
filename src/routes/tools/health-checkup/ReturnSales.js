import React from 'react'
import { Col, Row } from 'antd'
import { numberFormatter } from 'utils/numberFormat'

const ReturnSales = ({ listUnitAll }) => {
  return (
    <div>
      {listUnitAll.ReturnSales && listUnitAll.ReturnSalesJurnal && (
        <div>
          <Row>
            <Col span="6">ReturnSales:</Col>
            <Col span="18">{numberFormatter(listUnitAll.ReturnSales.summary)}</Col>
          </Row>
          <Row>
            <Col span="6" />
            <Col span="18">{numberFormatter(listUnitAll.ReturnSalesJurnal.summary)}</Col>
          </Row>
        </div>
      )}
    </div>
  )
}

export default ReturnSales

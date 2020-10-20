import React from 'react'
import { Link } from 'dva/router'
import { Col, Row } from 'antd'
import { numberFormatter } from 'utils/numberFormat'

const POS = ({ listUnitAll }) => {
  return (
    <div>
      {listUnitAll.POS && listUnitAll.POSJurnal && (
        <div>
          <Row>
            <Col span="6"><Link to="/report/pos/service">POS:</Link></Col>
            <Col span="18">{numberFormatter(listUnitAll.POS.summary)}</Col>
          </Row>
          <Row>
            <Col span="6" />
            <Col span="18">{numberFormatter(listUnitAll.POSJurnal.summary)}</Col>
          </Row>
        </div>
      )}
    </div>
  )
}

export default POS

import React from 'react'
import { Col, Row } from 'antd'
import { numberFormatter } from 'utils/numberFormat'
import { Link } from 'dva/router'

const AdjustIn = ({ listUnitAll }) => {
  return (
    <div>
      {listUnitAll.AdjustIn && listUnitAll.AdjustInJurnal && (
        <div>
          <Row>
            <Col span="6"><Link to="/report/adjust/in">AdjustIn:</Link></Col>
            <Col span="18">{numberFormatter(listUnitAll.AdjustIn.summary)}</Col>
          </Row>
          <Row>
            <Col span="6" />
            <Col span="18">{numberFormatter(listUnitAll.AdjustInJurnal.summary)}</Col>
          </Row>
        </div>
      )}
    </div>
  )
}

export default AdjustIn

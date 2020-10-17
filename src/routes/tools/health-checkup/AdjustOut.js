import React from 'react'
import { Col, Row } from 'antd'
import { numberFormatter } from 'utils/numberFormat'
import { Link } from 'dva/router'

const AdjustOut = ({ listUnitAll }) => {
  return (
    <div>
      {listUnitAll.AdjustOut && listUnitAll.AdjustOutJurnal && (
        <div>
          <Row>
            <Col span="6"><Link to="/report/adjust/out">AdjustOut:</Link></Col>
            <Col span="18">{numberFormatter(listUnitAll.AdjustOut.summary)}</Col>
          </Row>
          <Row>
            <Col span="6" />
            <Col span="18">{numberFormatter(listUnitAll.AdjustOutJurnal.summary)}</Col>
          </Row>
        </div>
      )}
    </div>
  )
}

export default AdjustOut

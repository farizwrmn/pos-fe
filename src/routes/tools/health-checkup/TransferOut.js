import React from 'react'
import { Link } from 'dva/router'
import { Col, Row } from 'antd'
import { numberFormatter } from 'utils/numberFormat'

const TransferOut = ({ listUnitAll }) => {
  return (
    <div>
      {listUnitAll.TransferOut && (
        <div>
          <Row>
            <Col span="6">
              <Link to="/report/inventory/transfer?activeKey=1">TransferOut</Link>
            </Col>
            <Col span="18">{numberFormatter(listUnitAll.TransferOut.summary)}</Col>
          </Row>
        </div>
      )}
    </div>
  )
}

export default TransferOut

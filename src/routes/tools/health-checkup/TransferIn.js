import React from 'react'
import { Link } from 'dva/router'
import { Col, Row } from 'antd'
import { numberFormatter } from 'utils/numberFormat'

const TransferIn = ({ listUnitAll }) => {
  return (
    <div>
      {listUnitAll.TransferIn && (
        <div>
          <Row>
            <Col span="6">
              <Link to="/report/inventory/transfer?activeKey=0">TransferIn</Link>
            </Col>
            <Col span="18">{numberFormatter(listUnitAll.TransferIn.summary)}</Col>
          </Row>
        </div>
      )}
    </div>
  )
}

export default TransferIn

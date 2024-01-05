import React from 'react'
import { connect } from 'dva'
import { Card, Button, Row, Col } from 'antd'
import { routerRedux } from 'dva/router'
import List from './List'
import ListTransferOut from './ListTransferOut'

const columnProps = {
  xs: 12,
  sm: 12,
  md: 3,
  lg: 3
}

const DeliveryOrderDetail = ({ dispatch, deliveryOrder }) => {
  const { listTransferOut, currentItem } = deliveryOrder
  const listProps = {
    dataSource: currentItem && currentItem.deliveryOrderDetail
  }

  const listTransferOutProps = {
    dataSource: listTransferOut && listTransferOut.length > 0 ? listTransferOut : []
  }

  const startScan = () => {
    dispatch(routerRedux.push(`/delivery-order-packer/${currentItem.id}`))
  }

  return (
    <Card>
      <div style={{ display: 'grid', gridTemplateColumns: '80% minmax(0, 20%)' }}>
        <div>
          <Row>
            <Col {...columnProps}>
              <h3>Transaction Number DO</h3>
            </Col>
            <Col {...columnProps}>
              <strong>{currentItem.transNo}</strong>
            </Col>
          </Row>

          <Row>
            <Col {...columnProps}>
              <h3>Quantity MUOUT</h3>
            </Col>
            <Col {...columnProps}>
              <h3>{currentItem.totalColly}</h3>
            </Col>
          </Row>

          <Row>
            <Col {...columnProps}>
              <h3>Box Number</h3>
            </Col>
            <Col {...columnProps}>
              <span />
            </Col>
          </Row>

          <Row>
            <Col {...columnProps}>
              <h3>Distribution Center</h3>
            </Col>
            <Col {...columnProps}>
              <h3>{currentItem.storeName}</h3>
            </Col>
          </Row>

          <Row>
            <Col {...columnProps}>
              <h3>Store Name Receiver</h3>
            </Col>
            <Col {...columnProps}>
              <h3>{currentItem.storeNameReceiver}</h3>
            </Col>
          </Row>

          <Row>
            <Col {...columnProps}>
              <h3>Shipment Date</h3>
            </Col>
            <Col {...columnProps}>
              <h3>{currentItem.transDate}</h3>
            </Col>
          </Row>

          <Row>
            <Col {...columnProps}>
              <h3>Duration</h3>
            </Col>
            <Col {...columnProps}>
              <span />
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
              <h3>Notes</h3>
            </Col>
            <Col {...columnProps}>
              <h3>{currentItem.memo}</h3>
            </Col>
          </Row>
        </div>

        <div>
          <Button type="primary" onClick={() => startScan()}>
            Start Scan
          </Button>
        </div>
      </div>

      <Row style={{ marginTop: '1em' }}>
        <Col>
          <List {...listProps} />
        </Col>
      </Row>
      <Row style={{ marginTop: '1em' }}>
        <Col>
          <ListTransferOut {...listTransferOutProps} />
        </Col>
      </Row>
    </Card>
  )
}

export default connect(({ deliveryOrder, loading, app }) => ({ deliveryOrder, loading, app }))(DeliveryOrderDetail)

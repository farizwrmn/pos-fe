import React from 'react'
import { connect } from 'dva'
import { Card, Row, Col } from 'antd'
import List from './List'

const columnProps = {
  xs: 12,
  sm: 12,
  md: 3,
  lg: 3
}

const DeliveryOrderDetail = ({ deliveryOrder }) => {
  const { currentItem } = deliveryOrder
  const listProps = {
    dataSource: currentItem && currentItem.deliveryOrderDetail
  }

  return (
    <Card>
      <Row gutter={8}>
        <Col {...columnProps}>
          <h3>ID</h3>
        </Col>
        <Col {...columnProps}>
          <h3>{currentItem.id}</h3>
        </Col>
      </Row>

      <Row gutter={8}>
        <Col {...columnProps}>
          <h3>No Transaksi DO</h3>
        </Col>
        <Col {...columnProps}>
          <strong>{currentItem.transNo}</strong>
        </Col>
      </Row>

      <Row gutter={8}>
        <Col {...columnProps}>
          <h3>Jumlah MUOUT</h3>
        </Col>
        <Col {...columnProps}>
          <h3>{currentItem.totalColly}</h3>
        </Col>
      </Row>

      <Row gutter={8}>
        <Col {...columnProps}>
          <h3>Nomor Box</h3>
        </Col>
        <Col {...columnProps}>
          {/* <h3>{currentItem}</h3> */}
        </Col>
      </Row>

      <Row gutter={8}>
        <Col {...columnProps}>
          <h3>Distribution Center</h3>
        </Col>
        <Col {...columnProps}>
          <h3>{currentItem.storeName}</h3>
        </Col>
      </Row>

      <Row gutter={8}>
        <Col {...columnProps}>
          <h3>Store Name Receiver</h3>
        </Col>
        <Col {...columnProps}>
          <h3>{currentItem.storeNameReceiver}</h3>
        </Col>
      </Row>

      <Row gutter={8}>
        <Col {...columnProps}>
          <h3>Tanggal Kirim</h3>
        </Col>
        <Col {...columnProps}>
          <h3>{currentItem.transDate}</h3>
        </Col>
      </Row>

      <Row gutter={8}>
        <Col {...columnProps}>
          <h3>Durasi</h3>
        </Col>
        <Col {...columnProps}>
          {/* <h3>{currentItem.memo}</h3> */}
        </Col>
      </Row>

      <Row gutter={8}>
        <Col {...columnProps}>
          <h3>{'Expired DO (Tanggal)'}</h3>
        </Col>
        <Col {...columnProps}>
          {/* <h3>{currentItem.memo}</h3> */}
        </Col>
      </Row>

      <Row gutter={8}>
        <Col {...columnProps}>
          <h3>Notes</h3>
        </Col>
        <Col {...columnProps}>
          <h3>{currentItem.memo}</h3>
        </Col>
      </Row>

      <Row style={{ marginTop: '1em' }}>
        <Col>
          <List {...listProps} />
        </Col>
      </Row>
    </Card>
  )
}

export default connect(({ deliveryOrder, loading, app }) => ({ deliveryOrder, loading, app }))(DeliveryOrderDetail)

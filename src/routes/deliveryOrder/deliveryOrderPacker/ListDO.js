import React from 'react'
import { Modal, Button, Row, Col } from 'antd'

const columnProps = {
  md: 12,
  lg: 6
}

const ListDO = ({ dispatch, loading, currentItem }) => {
  const onCompleteDeliveryOrder = (id, storeId, transNo, storeIdReceiver) => {
    Modal.confirm({
      title: 'Complete delivery order',
      content: 'Are you sure ?',
      onOk () {
        dispatch({
          type: 'deliveryOrder/updateAsFinished',
          payload: {
            id,
            storeId,
            transNo,
            storeIdReceiver
          }
        })
      }
    })
  }

  return (
    <div>
      <div>
        <Row>
          <Col {...columnProps}>
            <h3>Trans No.</h3>
          </Col>
          <Col {...columnProps}>
            <strong>{currentItem.transNo}</strong>
          </Col>
        </Row>

        <Row>
          <Col {...columnProps}>
            <h3>From</h3>
          </Col>
          <Col {...columnProps}>
            <h3>{currentItem.storeName}</h3>
          </Col>
        </Row>

        <Row>
          <Col {...columnProps}>
            <h3>To</h3>
          </Col>
          <Col {...columnProps}>
            <h3>{currentItem.storeNameReceiver}</h3>
          </Col>
        </Row>

        <Row>
          <Col {...columnProps}>
            <h3>Date</h3>
          </Col>
          <Col {...columnProps}>
            <h3>{currentItem.transDate}</h3>
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
            <h3>Description</h3>
          </Col>
          <Col {...columnProps}>
            <h3>{currentItem.description}</h3>
          </Col>
        </Row>
        <Row>
          <Col {...columnProps}>
            <h3>Complete</h3>
          </Col>
          <Col {...columnProps}>
            <Button disabled={(currentItem && currentItem.status) || loading.effects['deliveryOrder/updateAsFinished']} type="primary" icon="check" onClick={() => onCompleteDeliveryOrder(currentItem.id, currentItem.storeId, currentItem.transNo, currentItem.storeIdReceiver)}>
              Complete
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default ListDO

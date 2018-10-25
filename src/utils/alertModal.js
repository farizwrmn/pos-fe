import { Modal, Row, Col } from 'antd'

const stockMinusAlert = (data) => {
  return (
    Modal.warning({
      title: data.message,
      content: (
        <div>
          {data.detail}
          <Row>
            <Col span={5}>
              <p>Code</p>
              <p>Product</p>
              <p>Count</p>
            </Col>
            <Col span={1}>
              <p>:</p>
              <p>:</p>
              <p>:</p>
            </Col>
            <Col span={18}>
              <p>{data.data[0].productCode}</p>
              <p>{data.data[0].productName}</p>
              <p>{data.data[0].count}</p>
            </Col>
          </Row>
        </div>
      )
    })
  )
}
module.exports = {
  stockMinusAlert
}

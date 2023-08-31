import React from 'react'
import { Row, Col } from 'antd'
import { currencyFormatter } from 'utils/string'
import styles from './index.less'

const BodyItem = ({ item }) => {
  console.log('item', item)
  return (
    <div className={styles.item}>
      <Row>
        <Col>
          {item.paymentOptionName}
        </Col>
      </Row>
      <Row type="flex">
        <Col style={{ flex: 1 }}>
          Cashier Input
        </Col>
        <Col>
          {currencyFormatter(item.totalBalanceInput)}
        </Col>
      </Row>
      <Row type="flex">
        <Col style={{ flex: 1 }}>
          Total Penjualan
        </Col>
        <Col>
          {currencyFormatter(item.totalBalancePayment)}
        </Col>
      </Row>
      <Row type="flex">
        <Col style={{ flex: 1 }}>
          Selisih
        </Col>
        <Col>
          {currencyFormatter(item.diffBalance)}
        </Col>
      </Row>
    </div>
  )
}

export default BodyItem

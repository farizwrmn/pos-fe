import React from 'react'
import { Row, Col } from 'antd'
import { currencyFormatter } from 'utils/string'
import styles from './index.less'

const BodyItem = ({ item }) => {
  console.log('item', item)
  return (
    <div className={styles.item}>
      <Row>
        <Col className={styles.leftItem}>
          {item.paymentOptionName}
        </Col>
      </Row>
      <Row type="flex">
        <Col className={styles.leftItem} style={{ color: '#808080', paddingLeft: '20px' }}>
          Cashier Input
        </Col>
        <Col>
          {currencyFormatter(item.totalBalanceInput)}
        </Col>
      </Row>
      <Row type="flex">
        <Col className={styles.leftItem} style={{ color: '#808080', paddingLeft: '20px' }}>
          Penjualan
        </Col>
        <Col>
          {currencyFormatter(item.totalBalancePayment)}
        </Col>
      </Row>
      <Row type="flex">
        <Col className={styles.leftItem} style={{ color: '#808080', paddingLeft: '20px' }}>
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

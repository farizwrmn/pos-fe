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
      {item.totalBalanceInput > 0 && (
        <Row type="flex">
          <Col className={styles.leftItem} style={{ color: '#808080', paddingLeft: '10px' }}>
          Cashier Input
          </Col>
          <Col>
            {currencyFormatter(item.totalBalanceInput)}
          </Col>
        </Row>
      )}
      <Row type="flex">
        <Col className={styles.leftItem} style={{ color: '#808080', paddingLeft: '10px' }}>
          Penjualan
        </Col>
        <Col>
          {currencyFormatter(item.totalBalancePayment)}
        </Col>
      </Row>
      {item.diffBalance > 0 && (
        <Row type="flex">
          <Col className={styles.leftItem} style={{ color: '#808080', paddingLeft: '10px' }}>
          Selisih
          </Col>
          <Col>
            {currencyFormatter(item.diffBalance)}
          </Col>
        </Row>
      )}
    </div>
  )
}

export default BodyItem

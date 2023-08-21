import React from 'react'
import { Row, Col } from 'antd'
import { numberFormatter } from 'utils/string'
import styles from './index.less'

const BodyItem = ({ item }) => {
  return (
    <div className={styles.item}>
      <Row>
        <Col span={24} className={styles.left}>{item.typeText} - {item.paymentOption.typeName}</Col>
      </Row>
      <Row>
        <Col span={12} className={styles.left}>{numberFormatter(item.balanceIn)}</Col>
        <Col span={12} className={styles.right}>{numberFormatter(item.balanceIn)}</Col>
      </Row>
    </div>
  )
}

export default BodyItem

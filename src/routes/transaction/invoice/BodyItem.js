import React from 'react'
import { Row, Col } from 'antd'
import styles from './index.less'

const BodyItem = ({ item }) => {
  return (
    <div className={styles.item}>
      <Row>
        <Col span={12} className={styles.left}>{item.name} - {item.code}</Col>
      </Row>
      <Row>
        <Col span={12} className={styles.left}>{item.qty} x @{item.price}</Col>
        <Col span={12} className={styles.right}>{item.total}</Col>
      </Row>
    </div>
  )
}

export default BodyItem

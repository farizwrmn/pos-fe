import React from 'react'
import { Row, Col } from 'antd'
import { numberFormatter } from 'utils/string'
import styles from './index.less'

const BodyItem = ({ item }) => {
  return (
    <div className={styles.item}>
      <Row>
        <Col span={12} className={styles.left}>{item.name} - {item.code}</Col>
      </Row>
      <Row>
        <Col span={12} className={styles.left}>{numberFormatter(item.qty)} x @{numberFormatter(item.price)}</Col>
        <Col span={12} className={styles.right}>{numberFormatter(item.total)}</Col>
      </Row>
    </div>
  )
}

export default BodyItem

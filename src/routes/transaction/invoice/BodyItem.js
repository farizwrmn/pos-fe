import React from 'react'
import { Row, Col } from 'antd'
import { numberFormatter } from 'utils/string'
import styles from './index.less'

const BodyItem = ({ item }) => {
  return (
    <div className={styles.item}>
      <Row>
        <Col span={24} className={styles.left}>{item.name} - {item.code}</Col>
      </Row>
      <Row>
        <Col span={12} className={styles.left}>{numberFormatter(parseInt(item.qty, 0))} x @{numberFormatter(parseInt(item.total, 0) / item.qty)}</Col>
        <Col span={12} className={styles.right}>{numberFormatter(parseInt(item.total, 0))}</Col>
      </Row>
    </div>
  )
}

export default BodyItem

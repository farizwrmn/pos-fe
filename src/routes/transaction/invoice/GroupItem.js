import React from 'react'
import { Row, Col } from 'antd'
import styles from './index.less'

const GroupItem = ({ item }) => {
  return (
    <div>
      <Row>
        <Col span={24} className={styles.left}>{`${item.qty} x ${item.name}`}</Col>
      </Row>
    </div>
  )
}

export default GroupItem

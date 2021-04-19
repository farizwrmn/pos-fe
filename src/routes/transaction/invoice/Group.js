import React from 'react'
import { Row, Col } from 'antd'
import { numberFormatter } from 'utils/string'
import styles from './index.less'
import GroupItem from './GroupItem'

const Group = ({ item }) => {
  return (
    <div className={styles.item}>
      <Row>
        <Col span={24} className={styles.left}>{item.key}</Col>
      </Row>
      {item.detail && item.detail.map((item, index) => {
        return (
          <GroupItem key={index} item={item} />
        )
      })}
      <Row>
        <Col span={12} className={styles.left}>{`@${numberFormatter(item.price)}`}</Col>
        <Col span={12} className={styles.right}>{numberFormatter(item.total)}</Col>
      </Row>
    </div>
  )
}

export default Group

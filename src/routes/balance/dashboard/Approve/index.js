import React from 'react'
import { Row, Col } from 'antd'
import ApproveCard from './ApproveCard'
import styles from './index.less'

const Approve = ({
  list
}) => {
  return (
    <div>
      <Row>
        <Col md={24} lg={12}>
          <div className={styles.container}>
            <h1 className={styles.title}>Closing Report</h1>
            {list && list.map(item => (
              <ApproveCard item={item} />
            ))}
          </div>
        </Col>
        <Col md={24} lg={12}>
          <div className={styles.container}>
            <h1 className={styles.title}>Closing Alert</h1>
            {list && list.map(item => (
              <ApproveCard item={item} />
            ))}
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default Approve

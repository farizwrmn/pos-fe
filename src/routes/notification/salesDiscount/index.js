import React from 'react'
import {
  Row,
  Col
} from 'antd'
import styles from './index.less'

const SalesDiscount = () => {
  return (
    <div>
      <Row>
        <Col lg={6}>
          <h1>Sales Discount</h1>
          <div className={styles.content}>
            List
          </div>
        </Col>
        <Col lg={18} />
      </Row>
    </div>
  )
}

export default SalesDiscount

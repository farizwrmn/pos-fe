import React from 'react'
import { Row, Col } from 'antd'
import styles from './index.less'

const Header = ({ invoiceInfo }) => {
  return (
    <div>
      <div className={styles.center}>
        <div className={styles.title}>K3MART.ID</div>
        <div className={styles.subtitle}>ADAM MALIK</div>
      </div>
      <div className={styles.separator} />
      <div className={styles.left}>
        <div>Cashier : {invoiceInfo.employeeName}</div>
        <Row>
          <Col span={12}>
            <strong>Invoice</strong>
          </Col>
          <Col span={12} className={styles.right}>
            {invoiceInfo.transDatePrint}
          </Col>
        </Row>
        <div>
          <strong>#{invoiceInfo.lastTransNo}</strong>
        </div>
      </div>
    </div>
  )
}

export default Header

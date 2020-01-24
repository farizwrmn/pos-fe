import React from 'react'
import { Row, Col } from 'antd'
import styles from './index.less'

const Header = ({ invoiceInfo }) => {
  const { storeInfo } = invoiceInfo

  return (
    <div>
      <div className={styles.center}>
        <img
          src="/invoice-logo.png"
          style={{ height: '100%', width: '100%' }}
          alt="K3MART.ID"
        />
        <div className={styles.subtitle}>{storeInfo ? storeInfo.name : null}</div>
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

import React from 'react'
import { Row, Col } from 'antd'
import { APPNAME } from 'utils/config.company'
import styles from './index.less'

const Header = ({ onShowDeliveryOrder, invoiceInfo }) => {
  return (
    <div>
      <div className={styles.center}>
        <img
          src={`/invoice-logo-${APPNAME}.png`}
          style={{ height: '100%', width: '100%' }}
          alt={`${(APPNAME || '').toUpperCase()}`}
        />
        <button className={styles.buttonPrint} onClick={onShowDeliveryOrder}>Delivery Orders</button>
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
        {invoiceInfo && invoiceInfo.lastTransNo && (
          <div>
            <strong>{invoiceInfo.lastTransNo}</strong>
          </div>
        )}
        {invoiceInfo && invoiceInfo.consignmentNo && (
          <div>
            {invoiceInfo.consignmentNo}
          </div>
        )}
      </div>
    </div>
  )
}

export default Header

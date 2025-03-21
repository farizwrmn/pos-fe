import React from 'react'
import { Row, Col } from 'antd'
import { APPNAME } from 'utils/config.company'
import styles from './index.less'

const Header = ({ onShowInvoice, onShowKitchenOrder, loading, invoiceInfo }) => {
  return (
    <div>
      <div className={styles.center}>
        <img
          src={`/invoice-logo-${APPNAME}.png`}
          style={{ height: '100%', width: '100%' }}
          alt={`${(APPNAME || '').toUpperCase()}`}
        />
        <button disabled={loading.effects['payment/directPrintInvoice']} className={styles.buttonPrint} onClick={onShowInvoice}>Invoice</button> <br />
        <button disabled={loading.effects['payment/directPrintInvoice']} className={styles.buttonPrint} onClick={onShowKitchenOrder}>Kitchen</button>
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

import React from 'react'
import { Row, Col } from 'antd'
import { APPNAME } from 'utils/config.company'
import styles from './index.less'

const Header = ({ invoiceInfo }) => {
  return (
    <div>
      <div className={styles.center}>
        <img
          src={`/invoice-logo-${APPNAME}.png`}
          style={{ height: '100%', width: '100%' }}
          alt={`${(APPNAME || '').toUpperCase()}`}
        />
      </div>
      <div className={styles.separator} />
      <div className={styles.left}>
        <div>Printed By : {invoiceInfo.employeeName}</div>
        <Row>
          <Col span={12}>
            <strong>Closing Setoran</strong>
          </Col>
          <Col span={12} className={styles.right} />
        </Row>
        {invoiceInfo && invoiceInfo.id && (
          <div>
            <strong>#{invoiceInfo.id}</strong>
          </div>
        )}
        <div><strong>Open: </strong>{invoiceInfo.openDate}</div>
        <div><strong>Close: </strong>{invoiceInfo.closeDate}</div>
        <div><strong>Shift: </strong>{invoiceInfo.shift}</div>
        <div><strong>Cashier: </strong>{invoiceInfo.userName}</div>
        <div><strong>Pejabat Toko:</strong> {invoiceInfo.pejabatTokoName}</div>
        <div><strong>Store: </strong>{invoiceInfo.storeName}</div>
      </div>
    </div>
  )
}

export default Header

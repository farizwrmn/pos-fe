import React from 'react'
import { Row, Col } from 'antd'
import { currencyFormatter } from 'utils/string'
import styles from './index.less'

const MerchantCopy = ({
  posData = {},
  invoiceInfo = {},
  dataPos = [],
  dataService = [],
  dataConsignment = []
}) => {
  const merge = dataPos.length === 0 ? dataService : dataPos.concat(dataService)
  let Total = merge.concat(dataConsignment).reduce((cnt, o) => cnt + o.total, 0)

  return (
    <div className={styles.amountSection}>
      <Row>
        <Col span={12} className={styles.underlined}>
          <div className={styles.initialContent}>
            {invoiceInfo.transDatePrint}
          </div>
          <div className={styles.initialContent}>
            {posData.transNo}
          </div>
          {currencyFormatter(parseFloat(Total) + parseFloat(posData.dineInTax))}
        </Col>
        <Col span={12} className={styles.merchant}>
          <div className={styles.bordered}>
            Merchant Copy Card / E-Wallet Transaction
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default MerchantCopy

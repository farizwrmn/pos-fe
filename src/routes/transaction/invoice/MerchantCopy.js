import React from 'react'
import { Row, Col } from 'antd'
import { currencyFormatter } from 'utils/string'
import styles from './index.less'

const MerchantCopy = ({
  posData = {},
  invoiceInfo = {},
  dataPos = [],
  dataGroup = [],
  dataService = [],
  dataConsignment = [],
  listAmount = []
}) => {
  const merge = dataPos.concat(dataService).concat(dataGroup)
  let Total = merge.reduce((cnt, o) => cnt + o.total, 0)
  let TotalConsignment = dataConsignment.reduce((cnt, o) => cnt + o.total, 0)
  const cash = listAmount && listAmount.filter(filtered => filtered.typeCode === 'C')
  const showCopy = (listAmount.length > 0 && cash.length === 0) || (listAmount.length > 1 && cash.length > 0)

  if (!showCopy) {
    return null
  }

  return (
    <div>
      <div className={styles.amountSection}>
        <Row>
          <Col span={12} className={styles.underlined}>
            <div className={styles.initialContent}>
              {invoiceInfo.transDatePrint}
            </div>
            <div className={styles.initialContent}>
              {posData.transNo}
            </div>
            {currencyFormatter(parseInt(parseFloat(Total) + parseFloat(posData.dineInTax), 0))}
          </Col>
          <Col span={12} className={styles.merchant}>
            <div className={styles.bordered}>
              Merchant Copy Card / Mart Transaction
            </div>
          </Col>
        </Row>
      </div>
      <div className={styles.amountSection}>
        <Row>
          <Col span={12} className={styles.underlined}>
            <div className={styles.initialContent}>
              {invoiceInfo.transDatePrint}
            </div>
            <div className={styles.initialContent}>
              {posData.consignmentNo}
            </div>
            {currencyFormatter(parseFloat(TotalConsignment))}
          </Col>
          <Col span={12} className={styles.merchant}>
            <div className={styles.bordered}>
              Merchant Copy Card / Consignment Transaction
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default MerchantCopy

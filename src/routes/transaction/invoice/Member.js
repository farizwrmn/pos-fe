import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'antd'
import { numberFormatter } from 'utils/string'
import styles from './index.less'

const Member = ({
  invoiceInfo
}) => {
  if (!invoiceInfo) return null
  return (
    <div className={styles.amountSection}>
      <Row>
        <Col span={12} className={styles.right}>
          <span>
            <strong>
              MEMBER
            </strong>
          </span>
        </Col>
        <Col span={12} className={styles.right}>
          {invoiceInfo.memberName}
        </Col>
      </Row>
      {invoiceInfo.unitInfo && invoiceInfo.unitInfo.id && !invoiceInfo.unitInfo.defaultMember && (
        <Row>
          <Col span={12} className={styles.right}>
            <span>
              <strong>
                Point
              </strong>
            </span>
          </Col>
          <Col span={12} className={styles.right}>
            {numberFormatter(invoiceInfo.unitInfo.lastCashback)}
            {invoiceInfo.unitInfo.gettingCashback > 0 ? (
              <strong>{` (+${numberFormatter(invoiceInfo.unitInfo.gettingCashback)})`}</strong>
            ) : null}
          </Col>
        </Row>
      )}
      {invoiceInfo.posData && invoiceInfo.posData.orderShortNumber && (
        <div>
          <div span={12} className={styles.invoiceQueue} style={{ fontSize: 30, alignItems: 'center', justifyContent: 'center' }}>
            <strong>{invoiceInfo.posData.orderShortNumber}</strong>
          </div>
        </div>
      )}
      {invoiceInfo.posData && invoiceInfo.posData.orderType && (
        <div>
          <div span={12} className={styles.invoiceQueue} style={{ fontSize: 16, alignItems: 'center', justifyContent: 'center' }}>
            <strong>{invoiceInfo.posData.orderType}</strong>
          </div>
        </div>
      )}
    </div>
  )
}

Member.propTypes = {
  invoiceInfo: PropTypes.object.isRequired
}

export default Member

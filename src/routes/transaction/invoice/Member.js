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
          {numberFormatter(invoiceInfo.memberName)}
        </Col>
      </Row>
      {invoiceInfo.unitInfo && invoiceInfo.unitInfo.id && (
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
    </div>
  )
}

Member.propTypes = {
  invoiceInfo: PropTypes.object.isRequired
}

export default Member

import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'antd'
import { numberFormatter } from 'utils/string'
import { rest } from 'utils/config.company'
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
      {invoiceInfo.unitInfo && invoiceInfo.unitInfo.id && !invoiceInfo.unitInfo.defaultMember && (
        <Row>
          <Col span={12} className={styles.right}>
            <span>
              <strong>
                Coin
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

      <Row>
        <Col span={24} className={styles.center}>
          <div style={{ fontSize: '16px' }}>
            <strong>
              Gratis Delivery
            </strong>
          </div>
          <div>
            <strong>
              pesan langsung di
            </strong>
          </div>
          <div>
            <strong style={{ fontSize: '16px' }}>
              {rest.apiCompanyHost.replace('pos', 'www')}
            </strong>
          </div>
        </Col>
      </Row>
    </div>
  )
}

Member.propTypes = {
  invoiceInfo: PropTypes.object.isRequired
}

export default Member

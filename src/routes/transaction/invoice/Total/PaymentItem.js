import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'antd'
import { numberFormatter } from 'utils/string'
import {
  chooseOnePaymentType
} from '../utils'
import styles from '../index.less'

const PaymentItem = ({
  item,
  directPrinting,
  listOpts
}) => {
  if (!item) return null
  if (item && !item.typeCode) return null
  return (
    <div>
      <Row>
        <Col span={12} className={styles.right}>
          <span>
            <strong>
              {item.typeCode === 'XQ'
                && directPrinting
                && directPrinting
                  .filter(filtered => filtered.groupName === 'QRIS').length > 0
                ? `${directPrinting.filter(filtered => filtered.groupName === 'QRIS')[0].platformTransactionId} - `
                : ''}
              {chooseOnePaymentType(item.typeCode, listOpts)}
            </strong>
            :Rp
          </span>
        </Col>
        <Col span={12} className={styles.right}>
          {numberFormatter(item.paid + item.chargeTotal)}
        </Col>
      </Row>
    </div>
  )
}

PaymentItem.propTypes = {
  item: PropTypes.object.isRequired,
  listOpts: PropTypes.array.isRequired
}

export default PaymentItem

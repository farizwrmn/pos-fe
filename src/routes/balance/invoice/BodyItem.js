import React from 'react'
import { Row, Col } from 'antd'
import { BALANCE_TYPE_CLOSING } from 'utils/variable'
import { currencyFormatter } from 'utils/string'
import styles from './index.less'

const BodyItem = ({ item, itemTransaction }) => {
  if (item.balanceType === BALANCE_TYPE_CLOSING) {
    return (
      <div className={styles.item}>
        <Row>
          <Col span={24} className={styles.left}>{item.typeText} - {item.paymentOption.typeName}</Col>
        </Row>
        <Row>
          <Col span={12} className={styles.left}>POS: {currencyFormatter(itemTransaction.balanceIn)}</Col>
          <Col span={12} className={styles.right}>INPUT: {currencyFormatter(item.balanceIn)} {(itemTransaction.balanceIn || 0) - (item.balanceIn || 0) ? (<div>({currencyFormatter(((itemTransaction.balanceIn || 0) - (item.balanceIn || 0)) * -1)})</div>) : null}</Col>
        </Row>
      </div>
    )
  }
  return null
}

export default BodyItem

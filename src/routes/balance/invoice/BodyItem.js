import React from 'react'
// import { BALANCE_TYPE_CLOSING } from 'utils/variable'
import { Row, Col } from 'antd'
import { currencyFormatter } from 'utils/string'
import styles from './index.less'

const BodyItem = ({ item, itemTransaction, itemBalance }) => {
  // if (itemTransaction.balanceType === BALANCE_TYPE_CLOSING) {
  // const amount = itemBalance.total - itemTransaction.balanceIn > 0 ? -1 * (itemBalance.total - itemTransaction.balanceIn) : itemBalance.total
  const amount = itemBalance.total !== itemTransaction.balanceIn ? itemBalance.total - itemTransaction.balanceIn : ''

  return (
    <div className={styles.item}>
      <Row>
        <Col span={24} className={styles.left}>{item.typeText} - {item.paymentOption.typeName}</Col>
      </Row>
      <Row>
        <Col span={12} className={styles.left}>
          <div>
            POS: {currencyFormatter(itemTransaction.balanceIn)}
            {/* <p>{}<span>Lembar</span></p> */}
          </div>
        </Col>
        <Col span={12} className={styles.right}>
          <p>INPUT: {currencyFormatter(itemBalance.total)}</p>
          <p>{`(${currencyFormatter(amount)})`}</p>
        </Col>
      </Row>
    </div>
  )
  // }
  // return null
}

export default BodyItem

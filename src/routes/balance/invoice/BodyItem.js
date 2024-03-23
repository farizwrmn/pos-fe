import React from 'react'
import { BALANCE_TYPE_CLOSING } from 'utils/variable'
import { Row, Col } from 'antd'
import { currencyFormatter } from 'utils/string'
import styles from './index.less'

const BodyItem = ({ item, itemTransaction, itemBalance }) => {
  if (itemTransaction.balanceType === BALANCE_TYPE_CLOSING) {
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
          {/* <Col span={12} className={styles.right}>
            <p>INPUT: {currencyFormatter(itemBalance.total)}</p>
            <p>{`(${currencyFormatter(amount)})`}</p>
          </Col> */}
          <Col span={12} className={styles.right}>
            <p>INPUT: {currencyFormatter(item.balanceIn)}</p>
            {itemTransaction.balanceIn !== item.balanceIn && (
              <p>({currencyFormatter((itemTransaction.balanceIn - item.balanceIn) * -1)})</p>
            )}
          </Col>
        </Row>
      </div>
    )
  }
  return null
}

export default BodyItem

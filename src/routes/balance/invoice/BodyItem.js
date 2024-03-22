import React from 'react'
import { Row, Col } from 'antd'
import { currencyFormatter } from 'utils/string'
import styles from './index.less'

const BodyItem = ({ item, itemTransaction, itemBalance }) => {
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
          INPUT: {currencyFormatter(itemBalance.total)}
        </Col>
      </Row>
    </div>
  )
}

export default BodyItem

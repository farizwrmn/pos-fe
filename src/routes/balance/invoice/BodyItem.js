import React from 'react'
import { Row, Col } from 'antd'
import {
  BALANCE_TYPE_AWAL,
  BALANCE_TYPE_CLOSING,
  BALANCE_TYPE_TRANSACTION,

  TYPE_SALES
} from 'utils/variable'
import { numberFormatter } from 'utils/string'
import styles from './index.less'

const filterAndSum = (item, type, dataSource) => {
  const awal = dataSource
    .filter(filtered => filtered.type === type && filtered.paymentOptionId === item.paymentOptionId && filtered.balanceType === BALANCE_TYPE_AWAL)
    .reduce((prev, next) => prev + next.balanceIn, 0)
  const sales = dataSource
    .filter(filtered => filtered.type === type && filtered.paymentOptionId === item.paymentOptionId && filtered.balanceType === BALANCE_TYPE_TRANSACTION)
    .reduce((prev, next) => prev + next.balanceIn, 0)
  const transaction = dataSource
    .filter(filtered => filtered.type === type && filtered.paymentOptionId === item.paymentOptionId && filtered.balanceType === BALANCE_TYPE_CLOSING)
    .reduce((prev, next) => prev + next.balanceIn, 0)
  return ((awal + sales) - transaction) - (item.typeCode === 'C' ? awal : 0)
}

const BodyItem = ({ item, dataSource }) => {
  const sales = filterAndSum(item, TYPE_SALES, dataSource)
  return (
    <div className={styles.item}>
      <Row>
        <Col span={24} className={styles.left}>{item.typeText} - {item.paymentOption.typeName}</Col>
      </Row>
      <Row>
        <Col span={12} className={styles.left}>{sales !== 0 ? `Selisih: ${(sales * -1) > 0 ? '+' : ''}${numberFormatter(sales * -1)}` : ''}</Col>
        <Col span={12} className={styles.right}>{numberFormatter(item.balanceIn)}</Col>
      </Row>
    </div>
  )
}

export default BodyItem

import React from 'react'

import { Row, Col } from 'antd'
import { BALANCE_TYPE_TRANSACTION } from 'utils/variable'
import { currencyFormatter } from 'utils/string'
import { calculateBalance } from './utils'
import BodyItem from './BodyItem'
import styles from './index.less'

const Body = ({
  dataPos = [],
  paymentOptionCashId = 1
}) => {
  const totalAmountSetoran = calculateBalance(dataPos, paymentOptionCashId)
  return (
    <div>
      <div className={styles.borderedSection}>
        {dataPos && dataPos
          .map((item, index) => {
            const filteredBalance = dataPos.filter(filteredItem => filteredItem.balanceType === BALANCE_TYPE_TRANSACTION
              && filteredItem.paymentOption.typeCode === item.paymentOption.typeCode)
            let itemTransaction = {}
            if (filteredBalance && filteredBalance[0]) {
              itemTransaction = filteredBalance[0]
            }
            return (
              <BodyItem key={index} item={item} itemTransaction={itemTransaction} />
            )
          })}
        <Row>
          <Col style={{ textAlign: 'left', fontWeight: 500 }}>Total Uang Tunai Yang Mau Disetor</Col>
          <Col style={{ textAlign: 'left', fontWeight: 500 }}>{currencyFormatter(totalAmountSetoran)}</Col>
        </Row>
      </div>
    </div>
  )
}

export default Body

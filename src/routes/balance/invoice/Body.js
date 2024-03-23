import React from 'react'
import { BALANCE_TYPE_TRANSACTION } from 'utils/variable'
// import { Row, Col } from 'antd'
// import { currencyFormatter } from 'utils/string'
import BodyItem from './BodyItem'
import styles from './index.less'

const Body = ({
  dataPos = []
  // itemBalance
}) => {
  // let totalAmountSetoran = itemBalance.total
  return (
    <div>
      <div className={styles.borderedSection}>
        {dataPos && dataPos
          .map((item, index) => {
            const filteredBalance = dataPos.filter(filteredItem => item.paymentOption.typeCode === BALANCE_TYPE_TRANSACTION && filteredItem.paymentOption.typeCode === item.paymentOption.typeCode)
            let itemTransaction = {}
            if (filteredBalance && filteredBalance[0]) {
              itemTransaction = filteredBalance[0]
            }
            return (
              <BodyItem
                key={index}
                item={item}
                itemTransaction={itemTransaction}
              />
            )
          })}
        {/* <Row>
          <Col>Total Uang Tunai Yang Mau Disetor</Col>
          <Col>{currencyFormatter(totalAmountSetoran)}</Col>
        </Row> */}
      </div>
    </div>
  )
}

export default Body

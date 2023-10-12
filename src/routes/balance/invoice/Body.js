import React from 'react'
import { BALANCE_TYPE_TRANSACTION } from 'utils/variable'
import BodyItem from './BodyItem'
import styles from './index.less'

const Body = ({
  dataPos = []
}) => {
  console.log('dataPos', dataPos)
  return (
    <div>
      <div className={styles.borderedSection}>
        {dataPos && dataPos
          .filter(filtered => filtered.balanceIn > 0)
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
      </div>
    </div>
  )
}

export default Body

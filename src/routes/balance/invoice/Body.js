import React from 'react'
import BodyItem from './BodyItem'
import styles from './index.less'

const Body = ({
  dataPos = [],
  itemBalance
}) => {
  return (
    <div>
      <div className={styles.borderedSection}>
        {dataPos && dataPos
          .map((item, index) => {
            const filteredBalance = dataPos.filter(filteredItem => filteredItem.paymentOption.typeCode === item.paymentOption.typeCode)
            let itemTransaction = {}
            if (filteredBalance && filteredBalance[0]) {
              itemTransaction = filteredBalance[0]
            }
            if (itemTransaction.balanceIn !== 0) {
              return (
                <BodyItem
                  key={index}
                  item={item}
                  itemTransaction={itemTransaction}
                  itemBalance={itemBalance}
                />
              )
            }
            return null
          })}
      </div>
    </div>
  )
}

export default Body

import React from 'react'
import { BALANCE_TYPE_CLOSING } from 'utils/variable'
import BodyItem from './BodyItem'
import styles from './index.less'

const Body = ({
  dataPos = []
}) => {
  return (
    <div>
      <div className={styles.borderedSection}>
        {dataPos && dataPos
          .filter(filtered => filtered.balanceIn > 0
            && filtered.balanceType === BALANCE_TYPE_CLOSING
            && filtered.paymentOption.typeCode === 'C')
          .map((item, index) => {
            return (
              <BodyItem
                dataSource={dataPos
                  .filter(filtered => filtered.balanceIn > 0
                    && filtered.paymentOption.typeCode === 'C')}
                key={index}
                item={item}
              />
            )
          })}
      </div>
    </div>
  )
}

export default Body

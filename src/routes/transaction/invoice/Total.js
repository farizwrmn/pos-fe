import React from 'react'
import { Row, Col } from 'antd'
import { numberFormatter } from 'utils/string'
import styles from './index.less'

const Total = ({ posData = {}, dataPos = [], dataService = [] }) => {
  const merge = dataPos.length === 0 ? dataService : dataPos.concat(dataService)
  let TotalQty = merge.reduce((cnt, o) => cnt + o.qty, 0)
  let Total = merge.reduce((cnt, o) => cnt + o.total, 0)

  return (
    <div className={styles.amountSection}>
      <Row>
        <Col span={12} className={styles.right}>
          <span>
            <strong>
              Service Tax
            </strong>
            :Rp
          </span>
        </Col>
        <Col span={12} className={styles.right}>
          {numberFormatter(posData.dineInTax)}
        </Col>
      </Row>
      <Row>
        <Col span={12} className={styles.right}>
          <span>
            <strong>
              Total ({numberFormatter(parseFloat(TotalQty))} items)
            </strong>
            :Rp
          </span>
        </Col>
        <Col span={12} className={styles.right}>
          {numberFormatter(parseFloat(Total) + parseFloat(posData.dineInTax))}
        </Col>
      </Row>
    </div>
  )
}

export default Total

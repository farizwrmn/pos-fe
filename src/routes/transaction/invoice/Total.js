import React from 'react'
import { Row, Col } from 'antd'
import styles from './index.less'

const Total = ({ dataPos = [], dataService = [] }) => {
  const merge = dataPos.length === 0 ? dataService : dataPos.concat(dataService)
  let Total = merge.reduce((cnt, o) => cnt + o.total, 0)

  return (
    <div className={styles.amountSection}>
      <Row>
        <Col span={12} className={styles.right}>
          <span>
            <strong>
              Total ({merge ? merge.length : 0} items)
            </strong>
            :Rp
          </span>
        </Col>
        <Col span={12} className={styles.right}>
          {Total}
        </Col>
      </Row>
      <Row>
        <Col span={12} className={styles.right}><strong>Cash</strong>:Rp</Col>
        <Col span={12} className={styles.right}>
          {Total}
        </Col>
      </Row>
    </div>
  )
}

export default Total

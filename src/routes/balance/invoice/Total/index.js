import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'antd'
import { numberFormatter } from 'utils/string'
import styles from '../index.less'
import PaymentItem from './PaymentItem'

const Total = ({
  listAmount = [],
  listOpts = [],
  posData = {},
  dataPos = [],
  dataService = [],
  dataConsignment = [],
  dataGroup = []
}) => {
  const merge = dataPos.concat(dataService).concat(dataGroup).concat(dataConsignment)
  let TotalQty = merge.reduce((cnt, o) => cnt + o.qty, 0)
  let Total = merge.reduce((cnt, o) => cnt + o.total, 0)
  const curCharge = listAmount.reduce((cnt, o) => cnt + parseFloat(o.chargeTotal), 0)
  const curPayment = listAmount.reduce((cnt, o) => cnt + parseFloat(o.paid), 0)
  const curChange = curPayment - Total > 0 ? curPayment - (parseFloat(Total) + parseFloat(posData.dineInTax)) : 0

  return (
    <div className={styles.amountSection}>
      <Row>
        <Col span={12} className={styles.right}>
          <span>
            <strong>
              Service Charge
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
              Charge
            </strong>
            :Rp
          </span>
        </Col>
        <Col span={12} className={styles.right}>
          <strong className={styles.total}>
            {numberFormatter(parseFloat(curCharge))}
          </strong>
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
          <strong className={styles.total}>
            {numberFormatter(parseFloat(Total) + parseFloat(posData.dineInTax) + parseFloat(curCharge))}
          </strong>
        </Col>
      </Row>
      {listAmount && listAmount.map((item, index) => (
        <PaymentItem key={index} item={item} listOpts={listOpts} />
      ))}
      <Row>
        <Col span={12} className={styles.right}>
          <span>
            <strong>
              Change
            </strong>
            :Rp
          </span>
        </Col>
        <Col span={12} className={styles.right}>
          <strong className={styles.change}>
            {numberFormatter(curChange)}
          </strong>
        </Col>
      </Row>
    </div>
  )
}

Total.propTypes = {
  listAmount: PropTypes.array.isRequired
}

export default Total

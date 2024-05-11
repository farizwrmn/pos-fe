import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'antd'
import { numberFormatter } from 'utils/string'
import styles from '../index.less'
import PaymentItem from './PaymentItem'

const Total = ({
  directPrinting = [],
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

  return (
    <div className={styles.amountSection}>
      {posData.dineInTax && posData.dineInTax > 0 ? (
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
      ) : null}
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
            {numberFormatter(parseFloat(Total || 0) + parseFloat(posData.dineInTax || 0) + parseFloat(curCharge || 0))}
          </strong>
        </Col>
      </Row>
      {listAmount && listAmount.map((item, index) => (
        <PaymentItem directPrinting={directPrinting} key={index} item={item} listOpts={listOpts} />
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
            {numberFormatter(posData.change)}
          </strong>
        </Col>
      </Row>
      <Row>
        <Col span={12} className={styles.right}>
          <span>
            <strong>
              DPP
            </strong>
            :Rp
          </span>
        </Col>
        <Col span={12} className={styles.right}>
          {posData.dpp ? posData.dpp.toLocaleString(['ban', 'id'], { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : 0}
        </Col>
      </Row>
      {posData && posData.taxInfo && posData.taxInfo.length > 0 && (
        posData.taxInfo.map((item) => {
          return (
            <Row>
              <Col span={12} className={styles.right}>
                <span>
                  <strong>
                    {item.taxName}
                  </strong>
                  :Rp
                </span>
              </Col>
              <Col span={12} className={styles.right}>
                {item.PPN ? (item.PPN).toLocaleString(['ban', 'id'], { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : 0}
              </Col>
            </Row>
          )
        })
      )}
    </div>
  )
}

Total.propTypes = {
  listAmount: PropTypes.array.isRequired
}

export default Total

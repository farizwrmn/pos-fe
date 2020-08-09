import React from 'react'
import PropTypes from 'prop-types'
import {
  currencyFormatter
} from 'utils/string'
import { Row, Col } from 'antd'

const List = ({
  summaryBankRecon,
  listBankRecon,
  onSubmit
}) => {
  console.log('summaryBankRecon', summaryBankRecon)
  return (
    <div>
      {summaryBankRecon && summaryBankRecon[0] && (
        <div>
          {`Saldo: ${currencyFormatter(summaryBankRecon[0].amount)}`}
        </div>
      )}
      {listBankRecon && listBankRecon.map((item) => {
        return (
          <div>
            <Row>
              <Col span={12}>
                <div>{item.transDate}</div>
              </Col>
              <Col span={12}>
                {item.debit && <div>{`(DB) ${currencyFormatter(item.debit)}`}</div>}
                {item.credit && <div>{`(CR) ${currencyFormatter(item.credit)}`}</div>}
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <div>{item.transactionType}</div>
              </Col>
            </Row>
          </div>
        )
      })}
    </div>
  )
}

List.propTypes = {
  summaryBankRecon: PropTypes.array.isRequired,
  listBankRecon: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired
}

export default List

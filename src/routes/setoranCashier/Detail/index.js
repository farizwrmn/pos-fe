import { Row } from 'antd'
import { connect } from 'dva'
import React from 'react'
import ListSummary from './ListSummary'
import BalanceInfo from './BalanceInfo'

class CashierDetail extends React.Component {
  render () {
    const {
      setoranCashier
    } = this.props

    const {
      balanceInfo,
      listSummary,
      paginationSummary
    } = setoranCashier

    const listSummaryProps = {
      dataSource: listSummary,
      pagination: paginationSummary
    }

    const balanceInfoProps = {
      balanceInfo
    }

    return (
      <div className="content-inner">
        <Row>
          <BalanceInfo {...balanceInfoProps} />
        </Row>
        <Row>
          <ListSummary {...listSummaryProps} />
        </Row>
      </div>
    )
  }
}

export default connect(({
  setoranCashier
}) => ({
  setoranCashier
}))(CashierDetail)

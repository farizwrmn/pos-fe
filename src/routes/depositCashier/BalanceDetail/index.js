import React from 'react'
import { Row } from 'antd'
import { connect } from 'dva'
import ListSummary from './ListSummary'
import ListResolve from './ListResolve'
import BalanceInfo from './Info'

class DetailBalance extends React.Component {
  render () {
    const {
      depositCashier
    } = this.props

    const {
      depositBalanceDetailInfo,
      listDepositBalanceDetailSummary,
      listDepositBalanceDetailResolve
    } = depositCashier

    const listSummaryProps = {
      dataSource: listDepositBalanceDetailSummary
    }

    const listResolveProps = {
      dataSource: listDepositBalanceDetailResolve
    }

    return (
      <div className="content-inner">
        <BalanceInfo balanceInfo={depositBalanceDetailInfo} />
        <Row>
          <ListSummary {...listSummaryProps} />
        </Row>
        <Row>
          <ListResolve {...listResolveProps} />
        </Row>
      </div>
    )
  }
}

export default connect(({
  depositCashier
}) => ({
  depositCashier
}))(DetailBalance)


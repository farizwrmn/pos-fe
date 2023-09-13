import React from 'react'
import { Row } from 'antd'
import { connect } from 'dva'
import ListSummary from './ListSummary'
import BalanceInfo from './Info'

class DetailBalance extends React.Component {
  render () {
    const {
      loading,

      depositCashier
    } = this.props

    const {
      depositBalanceDetailInfo,
      listDepositBalanceDetailSummary
    } = depositCashier

    const listSummaryProps = {
      loading,
      dataSource: listDepositBalanceDetailSummary
    }

    return (
      <div className="content-inner">
        <BalanceInfo balanceInfo={depositBalanceDetailInfo} />
        <Row>
          <ListSummary {...listSummaryProps} />
        </Row>
      </div>
    )
  }
}

export default connect(({
  loading,
  depositCashier
}) => ({
  loading,
  depositCashier
}))(DetailBalance)


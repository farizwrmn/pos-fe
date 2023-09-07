import { Button, Row } from 'antd'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import React from 'react'
import ListBalance from './ListBalance'
import ListJournal from './ListJournal'

class BalanceDepositDetail extends React.Component {
  render () {
    const {
      location,
      dispatch,

      depositCashier
    } = this.props

    const {
      balanceDepositInfo,
      listDepositBalance,
      listDepositJournal
    } = depositCashier

    const handleBackButton = () => {
      const { query } = location
      dispatch(routerRedux.push({
        pathname: '/setoran/cashier',
        query
      }))
    }

    const listBalanceProps = {
      balanceDepositInfo,
      dataSource: listDepositBalance
    }

    const listJournalProps = {
      dataSource: listDepositJournal
    }

    return (
      <div className="content-inner">
        <Row style={{ marginBottom: '10px' }}>
          <Button type="primary" icon="rollback" onClick={handleBackButton}>Back</Button>
        </Row>
        <Row style={{ marginBottom: '10px' }}>
          <ListBalance {...listBalanceProps} />
        </Row>
        <Row>
          <ListJournal {...listJournalProps} />
        </Row>
      </div>
    )
  }
}

export default connect(({
  depositCashier
}) => ({
  depositCashier
}))(BalanceDepositDetail)

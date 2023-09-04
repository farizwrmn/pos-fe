import React from 'react'
import { Row } from 'antd'
import { connect } from 'dva'
import ListBalance from './ListBalance'
import ListResolve from './ListResolve'
import ListJournal from './ListJournal'

class DepositCashierDetail extends React.Component {
  render () {
    const listBalanceProps = {

    }

    const listResolveProps = {

    }

    const listGeneratedJournal = {

    }

    return (
      <div className="content-inner">
        <Row>
          <ListBalance {...listBalanceProps} />
        </Row>
        <Row>
          <ListResolve {...listResolveProps} />
        </Row>
        <Row>
          <ListJournal {...listGeneratedJournal} />
        </Row>
      </div>
    )
  }
}

export default connect()(DepositCashierDetail)

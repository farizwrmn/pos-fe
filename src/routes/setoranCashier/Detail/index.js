import React from 'react'
import { connect } from 'dva'

class CashierDetail extends React.Component {
  render () {
    const {
      setoranCashier
    } = this.props

    console.log('setoranCashier', setoranCashier)

    return (
      <div className="content-inner">
        Detail
      </div>
    )
  }
}

export default connect(({
  setoranCashier,
  accountRule
}) => ({
  setoranCashier,
  accountRule
}))(CashierDetail)

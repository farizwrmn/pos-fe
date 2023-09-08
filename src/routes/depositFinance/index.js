import React from 'react'
import { connect } from 'dva'

class DepositFinance extends React.Component {
  render () {
    return (
      <div className="content-inner">
        Deposit Finance
      </div>
    )
  }
}

export default connect(({
  depositFinance
}) => ({
  depositFinance
}))(DepositFinance)

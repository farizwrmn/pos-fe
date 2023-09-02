import React from 'react'
import { connect } from 'dva'

class SetoranCashier extends React.Component {
  render () {
    const {
      setoranCashier
    } = this.props

    console.log('setoranCashier', setoranCashier)

    return (
      <div className="content-inner">
        Setoran Cashier
      </div>
    )
  }
}

export default connect(({
  setoranCashier
}) => ({
  setoranCashier
}))(SetoranCashier)

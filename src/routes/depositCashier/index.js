import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, Row } from 'antd'
import List from './List'

class DepositCashier extends React.Component {
  render () {
    const {
      location,
      dispatch,

      depositCashier
    } = this.props

    const {
      list
    } = depositCashier

    const listProps = {
      location,
      dataSource: list
    }

    const handleAddDeposit = () => {
      dispatch(routerRedux.push('/setoran/cashier/add'))
    }

    return (
      <div className="content-inner">
        <Row justify="end" type="flex" style={{ marginBottom: '10px' }}>
          <Button type="primary" icon="plus" onClick={handleAddDeposit}>Add Deposit</Button>
        </Row>
        <Row>
          <List {...listProps} />
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
}))(DepositCashier)

import React from 'react'
import { Button, Checkbox, Row } from 'antd'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { lstorage } from 'utils'
import List from './List'

const { getCurrentUserRole } = lstorage

class DepositCashier extends React.Component {
  componentDidMount () {
    const { dispatch, location } = this.props
    const { pathname, query } = location
    const { all, ...other } = query
    const userRole = getCurrentUserRole()
    if (userRole !== 'OWN') {
      dispatch(routerRedux.push({
        pathname,
        query: other
      }))
    }
  }

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

    const { all = false } = location.query
    const userRole = getCurrentUserRole()

    const handleAddDeposit = () => {
      dispatch(routerRedux.push('/setoran/cashier/add'))
    }

    const onChangeAllStore = (event) => {
      const { checked } = event.target
      const { pathname, query } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          all: checked
        }
      }))
    }

    return (
      <div className="content-inner">
        {userRole === 'OWN' && (
          <Row>
            <Checkbox onChange={onChangeAllStore} checked={JSON.parse(all)}>All Store</Checkbox>
          </Row>
        )}
        <Row justify="end" type="flex" style={{ marginBottom: '10px' }}>
          <Button
            type="primary"
            icon="plus"
            onClick={handleAddDeposit}
          >
            Add Deposit
          </Button>
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

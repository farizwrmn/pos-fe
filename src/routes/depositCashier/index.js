import React from 'react'
import moment from 'moment'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, Checkbox, Row } from 'antd'
import { lstorage } from 'utils'
import List from './List'
import Filter from './Filter'

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
      loading,
      location,
      dispatch,

      depositCashier
    } = this.props

    const {
      list,
      pagination
    } = depositCashier

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
          all: checked,
          page: 1
        }
      }))
    }

    const listProps = {
      loading,
      location,
      dataSource: list,
      pagination,
      handleChangePagination: (paginationProps) => {
        const { current: page, pageSize } = paginationProps
        const { pathname, query } = location
        dispatch(routerRedux.push({
          pathname,
          query: {
            ...query,
            page,
            pageSize
          }
        }))
      }
    }

    const filterProps = {
      location,
      handleChangeDate: (rangeDate) => {
        const { pathname, query } = location
        if (rangeDate && rangeDate.length > 0) {
          dispatch(routerRedux.push({
            pathname,
            query: {
              ...query,
              startDate: moment(rangeDate[0]).format('YYYY-MM-DD'),
              endDate: moment(rangeDate[1]).format('YYYY-MM-DD'),
              page: 1
            }
          }))
        } else {
          const { startDate, endDate, ...other } = query
          dispatch(routerRedux.push({
            pathname,
            query: other
          }))
        }
      }
    }

    return (
      <div className="content-inner">
        {userRole === 'OWN' && (
          <Row style={{ marginBottom: '10px' }}>
            <Checkbox onChange={onChangeAllStore} checked={JSON.parse(all)}>All Store</Checkbox>
          </Row>
        )}
        <Row type="flex" align="middle" style={{ marginBottom: '10px' }}>
          <div style={{ flex: 1 }}>
            <Filter {...filterProps} />
          </div>
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

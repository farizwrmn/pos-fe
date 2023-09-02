import React from 'react'
import moment from 'moment'
import { Row } from 'antd'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import List from './List'
import Filter from './Filter'

class SetoranCashier extends React.Component {
  render () {
    const {
      dispatch,
      location,
      setoranCashier
    } = this.props

    const {
      list,
      pagination
    } = setoranCashier

    const listBalanceProps = {
      dataSource: list,
      pagination,
      handlePagination: (pagination) => {
        const { current: page, pageSize } = pagination
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
      onChangeDate: (dateRange) => {
        const { pathname, query } = location
        dispatch(routerRedux.push({
          pathname,
          query: {
            ...query,
            from: moment(dateRange[0]).format('YYYY-MM-DD'),
            to: moment(dateRange[1]).format('YYYY-MM-DD')
          }
        }))
      },
      onSearch: (q) => {
        const { pathname, query } = location
        dispatch(routerRedux.push({
          pathname,
          query: {
            ...query,
            q
          }
        }))
      }
    }

    return (
      <div className="content-inner">
        <Row style={{ marginBottom: '10px' }}>
          <Filter {...filterProps} />
        </Row>
        <Row>
          <List {...listBalanceProps} />
        </Row>
      </div>
    )
  }
}

export default connect(({
  setoranCashier
}) => ({
  setoranCashier
}))(SetoranCashier)

import React from 'react'
import { Row } from 'antd'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import ListBalance from './ListBalance'
import ListResolve from './ListResolve'
import ListJournal from './ListJournal'

class DepositCashierDetail extends React.Component {
  render () {
    const {
      location,
      dispatch,
      depositCashier
    } = this.props

    const {
      listDetail,
      paginationDetail,

      listResolve,
      paginationResolve,

      listJournal,
      paginationJournal
    } = depositCashier

    const listBalanceProps = {
      dataSource: listDetail,
      pagination: paginationDetail,
      handleChangePagination: (pagination) => {
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

    const listResolveProps = {
      dataSource: listResolve,
      pagination: paginationResolve,
      handleChangePagination: (pagination) => {
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

    const listGeneratedJournal = {
      dataSource: listJournal,
      pagination: paginationJournal,
      handleChangePagination: (pagination) => {
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

export default connect(({
  depositCashier
}) => ({
  depositCashier
}))(DepositCashierDetail)

import React from 'react'
import pathToRegexp from 'path-to-regexp'
import { Button, Row } from 'antd'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import ListSummary from './ListSummary'
import BalanceInfo from './BalanceInfo'

class CashierDetail extends React.Component {
  render () {
    const {
      location,
      dispatch,
      setoranCashier
    } = this.props

    const {
      balanceInfo,
      listSummaryTotal,
      listSummary,
      paginationSummary
    } = setoranCashier

    const handleBackButton = () => {
      const { query } = location
      dispatch(routerRedux.push({
        pathname: '/setoran/cashier',
        query
      }))
    }

    const listSummaryProps = {
      listSummaryTotal,
      dataSource: listSummary,
      pagination: paginationSummary,
      onChangePagination: (pagination) => {
        const { current: page, pageSize } = pagination
        const { pathname } = location
        const match = pathToRegexp('/setoran/cashier/:id').exec(pathname)
        if (match) {
          dispatch({
            type: 'setoranCashier/querySummary',
            payload: {
              balanceId: decodeURIComponent(match[1]),
              page,
              pageSize
            }
          })
        }
      }
    }

    const balanceInfoProps = {
      balanceInfo
    }

    return (
      <div className="content-inner">
        <Row style={{ marginBottom: '10px' }}>
          <Button icon="rollback" type="primary" onClick={handleBackButton}>Back</Button>
        </Row>
        <Row style={{ marginBottom: '10px' }}>
          <BalanceInfo {...balanceInfoProps} />
        </Row>
        <Row>
          <ListSummary {...listSummaryProps} />
        </Row>
      </div>
    )
  }
}

export default connect(({
  setoranCashier
}) => ({
  setoranCashier
}))(CashierDetail)

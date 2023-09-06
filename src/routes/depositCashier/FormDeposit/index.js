import React from 'react'
import moment from 'moment'
import { Button, Row } from 'antd'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import ListBalance from './ListBalance'
import ListJournal from './ListJournal'
import Filter from './Filter'

class DepositCashierDetail extends React.Component {
  render () {
    const {
      location,
      dispatch,
      depositCashier
    } = this.props

    const {
      summaryDetail,
      listDetail,
      paginationDetail,

      listJournal,
      paginationJournal,

      listResolveOption
    } = depositCashier

    console.log('listResolveOption', listResolveOption)

    const handleBackButton = () => {
      dispatch(routerRedux.push('/setoran/cashier'))
    }

    const listBalanceProps = {
      summaryDetail,
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

    const filterProps = {
      onSubmit: (data) => {
        const { rangeDate } = data
        if (rangeDate && rangeDate.length > 0) {
          const startDate = moment(rangeDate[0]).format('YYYY-MM-DD')
          const endDate = moment(rangeDate[1]).format('YYYY-MM-DD')
          console.log('startDate', startDate)
          console.log('endDate', endDate)
        }
      }
    }

    return (
      <div className="content-inner">
        <Row style={{ marginBottom: '30px' }}>
          <Button type="primary" icon="rollback" onClick={handleBackButton}>Back</Button>
        </Row>
        <Row style={{ marginBottom: '10px' }}>
          <Filter {...filterProps} />
        </Row>
        <Row style={{ marginBottom: '30px' }}>
          <ListBalance {...listBalanceProps} />
        </Row>
        <Row style={{ marginBottom: '10px' }}>
          <ListJournal {...listGeneratedJournal} />
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
}))(DepositCashierDetail)

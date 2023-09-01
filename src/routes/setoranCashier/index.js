import { Row } from 'antd'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import React from 'react'
import ListSummary from './ListSummary'

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

    const listSummaryProps = {
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

    return (
      <div className="content-inner">
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
}))(SetoranCashier)
